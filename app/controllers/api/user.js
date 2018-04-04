const {assoc} = require('ramda');
const User = require('../../models/user');
const {createLoggerWith} = require('../../logger');

const logger = createLoggerWith('[CTRL:User]');

const userController = {
  getUserInfo(userId) {
    return User.findById(userId, User.projection)
      .then(user => (user ? user.toJSON() : Promise.reject(null)))
      .then(user => {
        logger.info(':getUserInfo', `user ${userId} found`);
        return user;
      })
      .catch(err => {
        if (err === null) {
          logger.error(':getUserInfo', `user ${userId} not found`);
        } else {
          logger.error(':getUserInfo', 'error', err);
        }
        return Promise.reject(err);
      });
  },

  createUser(id, userData) {
    return User.findByIdAndUpdate(id, assoc('status', 'active', userData), {
      new: true,
      select: User.projection
    })
      .then(user => (user ? user.toJSON() : Promise.reject(null)))
      .then(user => {
        logger.info(':createUser', 'user created', user);
        return user;
      })
      .catch(err => {
        if (err === null) {
          logger.error(':createUser', `user ${id} not found`);
        } else {
          logger.error(':createUser', 'error', err);
        }
        return Promise.reject(err);
      });
  },
  updateUser(id, userData) {
    return User.findByIdAndUpdate(id, userData, {
      new: true,
      select: User.projection
    })
      .then(user => (user ? user.toJSON() : Promise.reject(null)))
      .then(user => {
        logger.info(':updateUser', 'user updated', user);
        return user;
      })
      .catch(err => {
        if (err === null) {
          logger.error(':updateUser', `user ${id} not found`);
        } else {
          logger.error(':updateUser', 'error', err);
        }
        return Promise.reject(err);
      });
  },

  isUsernameUnique(username) {
    return User.findOne({username}).catch(err => {
      logger.error(':isUsernameUnique', 'error', err);
      return Promise.reject(err);
    });
  }
};

module.exports = userController;
