const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');

const ExchangeSubject = {
  new: 'Exchange.new',
  accepted: 'Exchange.accepted',
  rejected: 'Exchange.rejected',
  validated: 'Exchange.validated',
  reported: 'Exchange.reported'
};

const NotificationSchema = new BaseSchema(
  {
    status: {
      type: String,
      enum: ['new', 'read'],
      required: true,
      index: true,
      default: 'new'
    },

    subject: {
      type: String,
      enum: Object.values(ExchangeSubject),
      required: true
    },

    recepient: {
      type: String,
      required: true,
      index: true
    },

    exchange: {
      type: String,
      ref: 'Exchange'
    }
  },
  {
    timestamps: true
  }
);

NotificationSchema.statics.projection = {};

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
