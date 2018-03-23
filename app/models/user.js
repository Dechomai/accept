const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');

const userSchema = new BaseSchema(
  {
    _id: String,
    email: String
  },
  {
    timestamps: true
  }
);

userSchema.statics.projection = {
  email: 1
};

userSchema.statics.findOneOrCreate = function(id, email) {
  return new Promise((resolve, reject) => {
    this.findById(id, (err, user) => {
      if (err) return reject(err);
      if (user) return resolve(user);
      new User({_id: id, email}).save((err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
