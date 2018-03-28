const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');

/*
  Cognito user statuses:
  UNCONFIRMED - User has been created but not confirmed.
  CONFIRMED - User has been confirmed.
  ARCHIVED - User is no longer active.
  COMPROMISED - User is disabled due to a potential security threat.
  UNKNOWN - User status is not known.

  */
const userSchema = new BaseSchema(
  {
    status: {
      type: String,
      enum: [
        'newreg', // registered in Cognito
        'active' // registered in app
      ],
      default: 'newreg'
    },
    // TODO: add validations
    _id: String,
    email: String,
    name: String,
    address: String,
    username: String,
    photoUrl: String,
    description: String,
    bcPublicKey: String
  },
  {
    timestamps: true
  }
);

userSchema.statics.projection = {
  email: 1,
  status: 1
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
