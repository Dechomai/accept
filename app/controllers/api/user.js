const User = require('../../models/user');

const userController = {
  getUserInfo(userId) {
    return User.findById(userId, User.projection).then(
      user => User.project(user.toJSON()),
      err => {
        console.log('err', err);
      }
    );
  }
};

module.exports = userController;
