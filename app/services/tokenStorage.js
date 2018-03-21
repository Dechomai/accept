const Token = require('../models/token');

// Note!
// Right now using MongoDB for storing refresh tokens
// TODO: In future it'll be better to migrate using some in-memory DB, eg. Redis

// Note!
// refresh tokens are stored per user id
// TODO: rethink

const tokenStorage = {
  getUserToken(userId) {
    return Token.findById(userId)
      .select('_id rt')
      .exec();
  },
  updateUserToken(userId, token) {
    return Token.findByIdAndUpdate(
      userId,
      {
        _id: userId,
        rt: token
      },
      {
        upsert: true
      }
    ).exec();
  },
  removeUserToken(userId) {
    return Token.deleteOne({_id: userId});
  }
};

module.exports = tokenStorage;