const User = require('../../models/user');
const logger = require('../../logger');

const userController = {
  getUserInfo(userId) {
    return User.findById(userId, User.projection)
      .then(user => (user ? user : Promise.reject(user)))
      .then(
        user => user.toJSON(),
        err => {
          if (!err) {
            logger.error('getUserInfo: no such user');
          } else {
            // TODO: handle error
            logger.error('getUserInfo error', err);
          }
          return Promise.reject(err);
        }
      );
  }
};

module.exports = userController;
