const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');

// const ProductSchema = require('./product');
// const ServiceSchema = require('./service');

const Listing = {
  type: String,
  enum: ['product', 'service'],
  required: true
};

const DayOfWeek = {
  type: Number,
  enum: [0, 1, 2, 3, 4, 5, 6] // 0 - Sunday
};

const TimeOfDay = {
  type: Number,
  enum: [0, 1, 2, 3]
};

const ExchangeSchema = new BaseSchema(
  {
    status: {
      type: String,
      enum: [
        'submitted', // submitted by `initiator`
        'new', // got contract address
        'canceled', // canceled by `initiator`
        'accepted', // accepted by `partner`
        'rejected', // rejected by `partner`
        'validatedByInitiator', // validated by `initiator`
        'validatedByPartner', // validated by `partner`
        'reportedByInitiator', // reported by `initiator`
        'reportedByPartner', // reported by `partner`
        'completed' // validated by both parties
      ],
      required: true,
      index: true
    },

    initiator: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },

    partner: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },

    initiatorItemType: Listing,
    initiatorItem: mongoose.Schema.Types.Mixed, // Product | Service
    initiatorItemQuantity: {
      type: Number,
      required: true
    },
    initiatorItemDays: [DayOfWeek],
    initiatorItemTime: [TimeOfDay],

    partnerItemType: Listing,
    partnerItem: mongoose.Schema.Types.Mixed, // Product | Service
    partnerItemQuantity: {
      type: Number,
      required: true
    },
    partnerItemDays: [DayOfWeek],
    partnerItemTime: [TimeOfDay],

    price: {
      type: Number,
      required: true
    },

    bcPendingTransactionHash: String,
    bcContractAddress: String
  },
  {
    timestamps: true
  }
);

ExchangeSchema.statics.projection = {};

const Exchange = mongoose.model('Exchange', ExchangeSchema);

module.exports = Exchange;
