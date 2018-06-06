const Notification = require('../models/notification');
const {createLoggerWith} = require('../logger');

const logger = createLoggerWith('[SVC:Notifications]');

class NotificationsService {
  publishNotification(subject, recepient, exchange) {
    const notification = new Notification({
      subject,
      recepient,
      exchange: exchange.id
    });
    return notification.save().then(notification => {
      logger.info('notification', notification.subject, 'created for user', notification.recepient);
      return notification;
    });
  }

  markAsRead(id) {
    return Notification.findByIdAndUpdate(id, {status: 'read'}, {new: true}).then(notification => {
      logger.info(
        'notification',
        notification.subject,
        'for user',
        notification.recepient,
        'marked as read'
      );
      return notification;
    });
  }
}

const notificationsService = new NotificationsService();

module.exports = notificationsService;
