const {assoc} = require('ramda');

const User = require('../../models/user');
const {createLoggerWith} = require('../../logger');
const mediaController = require('./media');
const blockchainService = require('../../services/blockchain');

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

  createUser(id, userData, avatar) {
    return (avatar ? mediaController.uploadUserAvatar(id, avatar) : Promise.resolve())
      .then(photo => (photo && photo.url ? assoc('photoUrl', photo.url, userData) : userData))
      .then(assoc('status', 'pending'))
      .then(data =>
        User.findByIdAndUpdate(id, data, {
          new: true,
          select: User.projection
        })
      )
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

  confirmUser(id, {address}) {
    return User.findById(id)
      .then(user => (user ? user.toJSON() : Promise.reject(null)))
      .then(user => {
        if (user.status !== 'pending') return Promise.reject('Invalid state');
        if (user.bcBonusTokensSent)
          return Promise.reject('Bonus tokens already to sent to this user');
        return this.sendBonusTokens(address);
      })
      .then(() =>
        User.findByIdAndUpdate(
          id,
          {
            status: 'active',
            bcDefaultAccountAddress: address,
            bcBonusTokensSent: true
          },
          {
            new: true,
            select: User.projection
          }
        )
      )
      .then(user => (user ? user.toJSON() : Promise.reject(null)))
      .catch(err => {
        if (err === null) {
          logger.error(':confirmUser', `user ${id} not found`);
        } else {
          logger.error(':confirmUser', 'error', err);
        }
        return Promise.reject(err);
      });
  },

  updateUser(id, userData, avatar) {
    return (avatar ? mediaController.uploadUserAvatar(id, avatar) : Promise.resolve())
      .then(photo => (photo && photo.url ? assoc('photoUrl', photo.url, userData) : userData))
      .then(data =>
        User.findByIdAndUpdate(id, data, {
          new: true,
          select: User.projection
        })
      )
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
  },

  sendBonusTokens(address) {
    // send bonus tokens
    return blockchainService.sendUserBonus(address);
  }
};

module.exports = userController;
