const User = require('../../models/user');
const logger = require('../../logger');

const userController = {
  getUserInfo(userId) {
    return User.findById(userId, User.projection).then(
      user => User.project(user.toJSON()),
      err => {
        // TODO: handle error
        logger.error('getUserInfo error', err);
      }
    );
  }
};

module.exports = userController;
