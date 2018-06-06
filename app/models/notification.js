const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');

const ExchangeSubject = {
  new: 'Exchange.new',
  canceled: 'Exchange.canceled',
  accepted: 'Exchange.accepted',
  rejected: 'Exchange.rejected',
  validatedByInitiator: 'Exchange.validatedByInitiator',
  validatedByPartner: 'Exchange.validatedByPartner',
  reportedByInitiator: 'Exchange.reportedByInitiator',
  reportedByPartner: 'Exchange.reportedByPartner',
  completed: 'Exchange.completed'
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
