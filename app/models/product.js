const mongoose = require('mongoose');
const BaseSchema = require('./utils/base');

const productSchema = new BaseSchema(
  {
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
    photosFolder: String,
    photos: [
      {
        uri: String,
        primary: Boolean
      }
    ],
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
  updatedAt: 0
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
