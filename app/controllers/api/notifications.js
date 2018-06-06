const Notification = require('../../models/notification');
const {createLoggerWith} = require('../../logger');

const logger = createLoggerWith('[CTRL:Notifications]');

const DEFAULT_SORT = {
  createdAt: -1
};

const TIME_TO_KEEP_READ_NOTIFICATIONS = 48 * 60 * 60 * 1000; // 48 hours

const notificationsController = {
  getNotifications(userId, sinceDate) {
    const query = {
      recepient: userId
    };

    if (sinceDate) {
      query.createdAt = {
        $gte: new Date(sinceDate)
      };
    }

    return this.cleanup(userId)
      .then(() =>
        Notification.find(query, Notification.projection, {
          sort: DEFAULT_SORT
        }).populate('exchange')
      )
      .then(notifications => {
        logger.info(
          ':getNotifications',
          `got ${notifications.length} notification/s for user`,
          userId
        );
        return notifications;
      })
      .catch(err => {
        logger.error(':getNotifications', 'error getting notifications for user', userId, err);
        return Promise.reject(err);
      });
  },

  markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recepient: userId
      },
      {
        status: 'read'
      },
      {
        new: true
      }
    ).then(
      notification => {
        if (notification) {
          logger.info(':markAsRead', 'notification', notificationId, 'for user', userId, 'updated');
          return notification.toJSON();
        }
        logger.error(
          ':markAsRead',
          'notification',
          notificationId,
          'for user',
          userId,
          'not found'
        );
        return Promise.reject(null);
      },
      err => {
        logger.error(
          'markAsRead',
          'Error retrieving notification',
          notificationId,
          'for user',
          userId,
          err
        );
      }
    );
  },

  cleanup(userId) {
    return Notification.deleteMany({
      recepient: userId,
      status: 'read',
      updatedAt: {
        $lte: new Date(new Date() - TIME_TO_KEEP_READ_NOTIFICATIONS)
      }
    }).then(args => {
      const {n} = args;
      logger.info(':cleanup', 'deleted', n, 'old notifications for user ', userId);
    });
  }
};

module.exports = notificationsController;
