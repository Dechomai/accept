const express = require('express');
const {body, query} = require('express-validator/check');
const {compose, assoc, pick} = require('ramda');

// const {createLoggerWith} = require('../../logger');
const {sendSuccess, sendError} = require('../../helpers/response');
const exchangesController = require('../../controllers/api/exchanges');
const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const {ADDRESS_REGEX, TRANSACTION_REGEX} = require('../../utils/blockchain');

// const logger = createLoggerWith('[RTR]:Exchanges');

const PATH = '/exchanges';

const DEFAULT_LIMIT = 30;

const States = {
  INCOMING: 'incoming',
  OUTCOMING: 'outcoming',
  PENDING: 'pending',
  REPORTED: 'reported',
  ARCHIVED: 'archived'
};

const exchangesRouter = express.Router();

exchangesRouter
  .route('/')
  .post(
    authMiddleware(),
    validationMiddleware(
      body('initiatorItemId')
        .exists()
        .isUUID(),
      body('initiatorItemType')
        .exists()
        .isIn(['product', 'service']),
      body('initiatorItemQuantity')
        .exists()
        .isInt({min: 1}),
      body('initiatorBcAddress')
        .exists()
        .custom(val => ADDRESS_REGEX.test(val)),
      body('partnerItemId')
        .exists()
        .isUUID(),
      body('partnerItemType')
        .exists()
        .isIn(['product', 'service']),
      body('partnerItemQuantity')
        .exists()
        .isInt({min: 1}),
      body('partnerBcAddress')
        .exists()
        .custom(val => ADDRESS_REGEX.test(val)),
      body('partner')
        .exists()
        .isUUID(),
      body('price')
        .exists()
        .isFloat(),
      body('bcTransactionHash')
        .exists()
        .custom(val => TRANSACTION_REGEX.test(val))
    ),
    (req, res) => {
      const {userId} = req;
      const exchangeData = compose(
        assoc('initiator', userId),
        pick([
          'initiatorItemId',
          'initiatorItemType',
          'initiatorItemQuantity',
          'initiatorBcAddress',
          'partnerItemId',
          'partnerItemType',
          'partnerItemQuantity',
          'partnerBcAddress',
          'partner',
          'price',
          'bcTransactionHash'
        ])
      )(req.body);

      exchangesController
        .createExchange(exchangeData)
        .then(
          exchange => sendSuccess(res, {exchange}),
          err => sendError(res, {message: err || 'Error creating exchange'})
        );
    }
  )
  .get(
    authMiddleware(),
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
      query('state')
        .exists()
        .isIn(Object.values(States))
    ),
    (req, res) => {
      const {userId} = req;
      const {state, limit = DEFAULT_LIMIT, skip = 0} = req.query;

      switch (state) {
        case States.OUTCOMING: {
          exchangesController.getOutcomingExchanges({userId, limit, skip}).then(
            ({exchanges, count}) => sendSuccess(res, {exchanges, count}),
            err => {
              if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
              sendError(res, {message: 'Error retrieving exchanges'});
            }
          );
          break;
        }
        case States.INCOMING: {
          exchangesController.getIncomingExchanges({userId, limit, skip}).then(
            ({exchanges, count}) => sendSuccess(res, {exchanges, count}),
            err => {
              if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
              sendError(res, {message: 'Error retrieving exchanges'});
            }
          );
          break;
        }
        default: {
          sendError(res, {message: `${state} state not yet implemented`});
        }
      }
    }
  );

module.exports = app => {
  app.use(PATH, exchangesRouter);
};
