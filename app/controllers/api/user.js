const {assoc} = require('ramda');
const User = require('../../models/user');
const {createLoggerWith} = require('../../logger');

const logger = createLoggerWith('[CTRL:User]');

const userController = {
  getUserInfo(userId) {
    return User.findById(userId, User.projection)
      .then(user => (user ? user : Promise.reject(user)))
      .then(
        user => user.toJSON(),
        err => {
          if (!err) {
            logger.error(':getUserInfo', 'no such user');
          } else {
            // TODO: handle error
            logger.error(':getUserInfo', 'error', err);
          }
          return Promise.reject(err);
        }
      );
  },
  createUser(id, userData) {
    return User.findByIdAndUpdate(id, assoc('status', 'active', userData), {
      new: true,
      select: User.projection
    })
      .then(user => {
        if (!user) return Promise.reject({message: `User id: ${id}, not found`});
        logger.info(':createUser', 'user created', user.toObject());
        return user.toJSON();
      })
      .catch(err => {
        logger.error(':createUser', 'error', err);
        return Promise.reject(err);
      });
  },
  isUsernameUnique(username) {
    return User.findOne({username: username}).catch(err => {
      logger.error(':isUsernameUnique', 'error', err);
      return Promise.reject(err);
    });
  }
};

module.exports = userController;
