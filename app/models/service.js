const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');
const photoSchema = require('./photoSchema');

const serviceSchema = new BaseSchema(
  {
    _id: String,
    title: {
      type: String,
      required: true
    },
    createdBy: {
      type: String, // User.id (Cognito User Id)
      ref: 'User',
      required: true,
      index: true
    },
    photos: [photoSchema],
    primaryPhotoId: String,
    video: String,
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
      index: true
    }
  },
  {
    timestamps: true
  }
);

serviceSchema.statics.projection = {
  updatedAt: 0,
  status: 0
};

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
