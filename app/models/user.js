const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
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
    email: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: String,
    phone: String,
    username: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4() // generate unique value by default for "newreg" users
    },
    photoUrl: String,
    description: String,
    bcPublicKey: String
  },
  {
    timestamps: true
  }
);

userSchema.statics.projection = {
  status: 1,
  email: 1,
  firstName: 1,
  lastName: 1,
  address: 1,
  phone: 1,
  username: 1,
  photoUrl: 1,
  description: 1
};

userSchema.statics.publicProjection = {
  firstName: 1,
  lastName: 1,
  username: 1,
  photoUrl: 1,
  description: 1
};

userSchema.statics.findOneOrCreate = function(id, email) {
  return new Promise((resolve, reject) => {
    this.findById(id, (err, user) => {
      if (err) return reject(err);
      if (user) return resolve(user);
      new User({_id: id, email}).save(
        {
          validateBeforeSave: false
        },
        (err, user) => {
          if (err) return reject(err);
          resolve(user);
        }
      );
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
