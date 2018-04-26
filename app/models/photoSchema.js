const BaseSchema = require('./utils/base');

const photoSchema = new BaseSchema({
  _id: String,
  url: {
    type: String,
    required: true
  }
});

module.exports = photoSchema;
