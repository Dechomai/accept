const express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const {createLoggerWith} = require('../../logger');
const {body, query, param} = require('express-validator/check');
const {isUUID} = require('validator');
const {assoc, pick, compose} = require('ramda');
const {sendSuccess, sendError} = require('../../helpers/response');
const productsController = require('../../controllers/api/products');
const mediaController = require('../../controllers/api/media');
const logger = createLoggerWith('[RTR]:Media');
const authMiddleware = require('../../middlewares/auth');
const upload = multer({includeEmptyFields: true});
const validationMiddleware = require('../../middlewares/validation');

const PATH = '/products';

const DEFAULT_LIMIT = 30; // TODO: move to configuration or smth

const productsRouter = express.Router();

productsRouter
  .route('/')
  .get(
    validationMiddleware(
      query('limit')
        .optional()
        .isInt({min: 1, max: 100})
        .toInt(),
      query('skip')
        .optional()
        .isInt({min: 0})
        .isInt()
        .toInt(),
      query('user')
        .optional()
        .custom(value => isUUID(value) || value === 'current')
    ),
    (req, res) => {
      const {user, limit = DEFAULT_LIMIT, skip = 0} = req.query;

      if (user) {
        new Promise(resolve => {
          if (user !== 'current') return resolve(user);
          authMiddleware(req, res, () => {
            resolve(req.userId);
          });
        }).then(userId => {
          productsController.getProductsForUser(userId, {limit, skip}).then(
            ({products, count}) => sendSuccess(res, {limit, skip, count, products}),
            err => {
              if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
              sendError(res, {message: 'Error getting products'});
            }
          );
        });
      } else {
        productsController.getProducts({limit, skip}).then(
          ({products, count}) => sendSuccess(res, {limit, skip, count, products}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error getting products'});
          }
        );
      }
    }
  )
  .post(
    authMiddleware,
    upload.array('photos', 8),
    (err, req, res, next) => {
      if (err) {
        logger.error('post:products', err);
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          logger.error('post:products', 'LIMIT_UNEXPECTED_FILE', err);
          return sendError(res, {message: 'Invalid request'}, {status: 400});
        }
        logger.error('post:products', 'Unknown error', err);
        return sendError(res, {message: 'Error processing request'}, {status: 400});
      }
      next();
    },
    validationMiddleware(
      body('title')
        .exists()
        .isLength({min: 3, max: 400}),
      body('video')
        .optional({
          checkFalsy: true
        })
        .isURL(),
      body('description')
        .exists()
        .isLength({min: 10, max: 800}),
      body('condition')
        .exists()
        .isIn(['new', 'used']), // get condition statuses from somewhere
      body('price')
        .exists()
        .isFloat({min: 0, max: 2000000})
    ),
    (req, res) => {
      const productId = uuidv4();

      const {files} = req;
      if (files.some(file => !/image\/(png|gif|jpeg)/.test(file.mimetype))) {
        logger.error('post:product', 'Invalid file type');
        return sendError(
          res,
          {message: 'Invalid file type. Only png, gif, jpeg are supported'},
          {status: 400}
        );
      }
      const buffers = files.map(file => file.buffer);
      mediaController
        .uploadProductImages(productId, buffers)
        .then(
          results => {
            logger.info('post:products', 'Images uploaded', results);
            return results.map(image => image.url);
          },
          err => {
            logger.error('post:products', 'Error uploading images', err);
            sendError(res, {message: 'Error uploading images'}, {status: 400});
          }
        )
        .then(imageUrls => {
          const {userId} = req;
          const data = compose(
            assoc('_id', productId),
            assoc('photos', imageUrls),
            pick([
              'title',
              'createdBy',
              'video',
              'description',
              'condition',
              'price',
              'primaryPhotoIndex'
            ])
          )(req.body);

          return productsController.addProduct(data, userId);
        })
        .then(
          product => sendSuccess(res, {product}),
          () => sendError(res, {message: 'Error creating product'})
        );
    }
  );

productsRouter
  .route('/:productId')
  .all(
    validationMiddleware(
      param('productId')
        .exists()
        .isMongoId()
    )
  )
  .get((req, res) => {
    const {productId} = req.params;
    productsController.getProduct(productId).then(
      product => sendSuccess(res, {product}),
      err => {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: 'Error getting product'});
      }
    );
  });

module.exports = app => {
  app.use(PATH, productsRouter);
};
