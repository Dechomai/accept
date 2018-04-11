const express = require('express');
const {body, query, param} = require('express-validator/check');
const {isUUID} = require('validator');
const {pick} = require('ramda');
const {sendSuccess, sendError} = require('../../helpers/response');
const productsController = require('../../controllers/api/products');
const authMiddleware = require('../../middlewares/auth');
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
        const userId = user === 'current' ? req.userId : user;

        productsController.getProductsForUser(userId, {limit, skip}).then(
          ({products, count}) => sendSuccess(res, {limit, skip, count, products}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error getting products'});
          }
        );
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
      const {userId} = req;
      const data = pick(
        ['title', 'createdBy', 'video', 'photos', 'description', 'condition', 'price'],
        req.body
      );
      productsController
        .addProduct(data, userId)
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
