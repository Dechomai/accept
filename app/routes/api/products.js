const express = require('express');
const {body, query, param} = require('express-validator/check');
const {isUUID} = require('validator');
const {pick} = require('ramda');
const {createLoggerWith} = require('../../logger');
const {sendSuccess, sendError} = require('../../helpers/response');
const productsController = require('../../controllers/api/products');
const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const {createArrayUploadMiddleware} = require('../../middlewares/upload');

const logger = createLoggerWith('[RTR]:Products');

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
    createArrayUploadMiddleware({field: 'photos', maxCount: 8})({
      logger,
      logPrefix: 'post:products'
    }),
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
    createArrayUploadMiddleware({field: 'newPhotos', maxCount: 8})({
      logger,
      logPrefix: 'post:products'
    }),
    (req, res, next) => {
      if (typeof req.body.removedPhotos === 'string') {
        req.body.removedPhotos = [req.body.removedPhotos];
      }
      next();
    },
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
    async (req, res) => {
      const {userId, files: newPhotos} = req;
      const {productId} = req.params;
      const productData = pick(
        ['title', 'video', 'description', 'condition', 'price', 'primaryPhotoIndex'],
        req.body
      );
      const {removedPhotos = []} = req.body;
      try {
        const ownedProduct = await productsController.isProductOwner(userId, productId);
        if (!ownedProduct) {
          return sendError(
            res,
            {message: 'Current user is not owner of this product'},
            {status: 403}
          );
        }
        try {
          const product = await productsController.editProduct(
            ownedProduct,
            productData,
            newPhotos,
            removedPhotos
          );
          sendSuccess(res, {product});
        } catch (err) {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: typeof err === 'string' ? err : 'Error editing product'});
        }
      } catch (err) {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: 'Error checking product ownership'});
      }
    }
  )
  .delete(authMiddleware, async (req, res) => {
    const {userId} = req;
    const {productId} = req.params;
    try {
      const ownedProduct = await productsController.isProductOwner(userId, productId);
      if (!ownedProduct) {
        return sendError(
          res,
          {message: 'Current user is not owner of this product'},
          {status: 403}
        );
      }
      try {
        await productsController.removeProduct(ownedProduct);
        sendSuccess(res);
      } catch (err) {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: typeof err === 'string' ? err : 'Error removing product'});
      }
    } catch (err) {
      if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
      sendError(res, {message: 'Error checking product ownership'});
    }
  });

module.exports = app => {
  app.use(PATH, productsRouter);
};
