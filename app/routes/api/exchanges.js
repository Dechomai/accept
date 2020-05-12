const express = require('express');
const {body, query, param} = require('express-validator/check');
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

const Actions = {
  CANCEL: 'cancel',
  ACCEPT: 'accept',
  REJECT: 'reject',
  VALIDATE: 'validate',
  REPORT: 'report'
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
      body('initiatorItemDays')
        .exists()
        .isArray()
        .custom(days => days.length <= 7),
      body('initiatorItemDays.*')
        .optional()
        .isInt({min: 0, max: 6}),
      body('initiatorItemTime')
        .exists()
        .isArray()
        .custom(time => time.length <= 4),
      body('initiatorItemTime.*')
        .optional()
        .isInt({min: 0, max: 3}),
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
      body('partnerItemDays')
        .exists()
        .isArray()
        .custom(days => days.length <= 7),
      body('partnerItemDays.*')
        .optional()
        .isInt({min: 0, max: 6}),
      body('partnerItemTime')
        .exists()
        .isArray()
        .custom(time => time.length <= 4),
      body('partnerItemTime.*')
        .optional()
        .isInt({min: 0, max: 3}),
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
          'initiatorItemDays',
          'initiatorItemTime',
          'initiatorBcAddress',
          'partnerItemId',
          'partnerItemType',
          'partnerItemQuantity',
          'partnerItemDays',
          'partnerItemTime',
          'partnerBcAddress',
          'partner',
          'price',
          'bcTransactionHash'
        ])
      )(req.body);

      exchangesController.createExchange(exchangeData).then(
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
      let getExchanges;

      switch (state) {
        case States.INCOMING: {
          getExchanges = exchangesController.getIncomingExchanges({userId, limit, skip});
          break;
        }
        case States.OUTCOMING: {
          getExchanges = exchangesController.getOutcomingExchanges({userId, limit, skip});
          break;
        }
        case States.PENDING: {
          getExchanges = exchangesController.getPendingExchanges({userId, limit, skip});
          break;
        }
        case States.REPORTED: {
          getExchanges = exchangesController.getReportedExchanges({userId, limit, skip});
          break;
        }
        case States.ARCHIVED: {
          getExchanges = exchangesController.getArchivedExchanges({userId, limit, skip});
          break;
        }
        default: {
          return sendError(res, {message: `${state} state not yet implemented`});
        }
      }

      getExchanges.then(
        ({exchanges, count}) => sendSuccess(res, {exchanges, count}),
        err => {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: 'Error retrieving exchanges'});
        }
      );
    }
  );

exchangesRouter.post(
  '/:exchangeId',
  authMiddleware(),
  validationMiddleware(
    param('exchangeId')
      .exists()
      .isMongoId(),
    body('action')
      .exists()
      .isIn(Object.values(Actions)),
    body('bcTransactionHash')
      .exists()
      .custom(val => TRANSACTION_REGEX.test(val))
  ),
  (req, res) => {
    const {userId} = req;
    const {exchangeId} = req.params;
    const {action, bcTransactionHash} = req.body;

    switch (action) {
      case Actions.CANCEL: {
        exchangesController.cancelExchange({userId, exchangeId, txHash: bcTransactionHash}).then(
          exchange => sendSuccess(res, {exchange}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error canceling exchange'});
          }
        );
        break;
      }
      case Actions.ACCEPT: {
        exchangesController.acceptExchange({userId, exchangeId, txHash: bcTransactionHash}).then(
          exchange => sendSuccess(res, {exchange}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error accepting exchange'});
          }
        );
        break;
      }
      case Actions.REJECT: {
        exchangesController.rejectExchange({userId, exchangeId, txHash: bcTransactionHash}).then(
          exchange => sendSuccess(res, {exchange}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error accepting exchange'});
          }
        );
        break;
      }
      case Actions.VALIDATE: {
        exchangesController.validateExchange({userId, exchangeId, txHash: bcTransactionHash}).then(
          exchange => sendSuccess(res, {exchange}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error accepting exchange'});
          }
        );
        break;
      }
      case Actions.REPORT: {
        exchangesController.reportExchange({userId, exchangeId, txHash: bcTransactionHash}).then(
          exchange => sendSuccess(res, {exchange}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error accepting exchange'});
          }
        );
        break;
      }
      default: {
        return sendError(res, {message: `${action} action not yet implemented`});
      }
    }
  }
);

module.exports = app => {
  app.use(PATH, exchangesRouter);
};
