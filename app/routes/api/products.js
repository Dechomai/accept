const express = require('express');
const multer = require('multer');
const {createLoggerWith} = require('../../logger');
const {body, query, param} = require('express-validator/check');
const {isUUID} = require('validator');
const {pick} = require('ramda');
const {sendSuccess, sendError} = require('../../helpers/response');
const productsController = require('../../controllers/api/products');
const logger = createLoggerWith('[RTR]:Media');
const authMiddleware = require('../../middlewares/auth');
const upload = multer({includeEmptyFields: true});
const validationMiddleware = require('../../middlewares/validation');
const uploadErrorHandler = require('../../middlewares/uploadErrorHandler');

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
    uploadErrorHandler(logger, 'post:products', /image\/(png|gif|jpeg)/),
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
      const {userId, files} = req;
      const productData = pick(
        ['title', 'video', 'description', 'condition', 'price', 'primaryPhotoIndex'],
        req.body
      );

      return productsController
        .addProduct(productData, files, userId)
        .then(
          product => sendSuccess(res, {product}),
          error => sendError(res, {message: error || 'Error creating product'})
        );
    }
  );

productsRouter
  .route('/:productId')
  .all(
    validationMiddleware(
      param('productId')
        .exists()
        .isUUID()
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
  })
  .put(
    authMiddleware,
    upload.array('newPhotos', 8),
    uploadErrorHandler(logger, 'put:product', /image\/(png|gif|jpeg)/),
    validationMiddleware(
      body('title')
        .optional()
        .isLength({min: 3, max: 400}),
      body('video')
        .optional({
          checkFalsy: true
        })
        .isURL(),
      body('description')
        .optional()
        .isLength({min: 10, max: 800}),
      body('condition')
        .optional()
        .isIn(['new', 'used']),
      body('price')
        .optional()
        .isFloat({min: 0, max: 2000000}),
      body('removedPhotos.*')
        .optional()
        .isUUID()
    ),
    (req, res) => {
      const {userId, files: newPhotos} = req;
      const {productId} = req.params;
      const productData = pick(
        ['title', 'video', 'description', 'condition', 'price', 'primaryPhotoIndex'],
        req.body
      );
      const {removedPhotos} = req.body;

      return productsController
        .getProduct(productId)
        .then(product => {
          if (product.createdBy.id !== userId) {
            return Promise.reject('Current user is not owner of this product');
          }

          return productsController.editProduct(product, productData, newPhotos, removedPhotos);
        })
        .then(
          product => sendSuccess(res, {product}),
          error => sendError(res, {message: error || 'Error editing product'})
        );
    }
  );

module.exports = app => {
  app.use(PATH, productsRouter);
};
