const express = require('express');
const {query, param} = require('express-validator/check');

// const {createLoggerWith} = require('../../logger');
const {sendSuccess, sendError} = require('../../helpers/response');
const notificationsController = require('../../controllers/api/notifications');
const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');

// const logger = createLoggerWith('[RTR]:Notifications');

const PATH = '/notifications';

const notificationsRouter = express.Router();

notificationsRouter
  .get(
    '/',
    authMiddleware(),
    validationMiddleware(
      query('since')
        .optional()
        .isISO8601() // ISO date
    ),
    (req, res) => {
      const {userId} = req;
      const {since} = req.query;

      notificationsController.getNotifications(userId, since).then(
        notifications => sendSuccess(res, {notifications}),
        err => {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: 'Error retrieving notifications'});
        }
      );
    }
  )
  .post(
    '/:notificationId',
    authMiddleware(),
    validationMiddleware(
      param('notificationId')
        .exists()
        .isMongoId()
    ),
    (req, res) => {
      const {userId} = req;
      const {notificationId} = req.params;

      notificationsController.markAsRead(notificationId, userId).then(
        notification => sendSuccess(res, {notification}),
        err => {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: 'Error updating notification'});
        }
      );
    }
  );

module.exports = app => {
  app.use(PATH, notificationsRouter);
};
