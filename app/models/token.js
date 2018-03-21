const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema(
  {
    _id: String,
    rt: String
  },
  {
    timestamps: true
  }
);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
