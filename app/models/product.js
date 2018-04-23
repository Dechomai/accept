const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');

const photoSchema = new BaseSchema({
  _id: String,
  url: {
    type: String,
    required: true
  }
});

const productSchema = new BaseSchema(
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
    condition: {
      type: String,
      enum: ['new', 'used'],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

/*
  Add virtual: thumbnailUri
*/

productSchema.statics.projection = {
  updatedAt: 0,
  status: 0
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
