const mongoose = require('mongoose');

module.exports = class BaseSchema extends mongoose.Schema {
  constructor(definition, options) {
    super(
      definition,
      Object.assign(
        {
          toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret /* , options */) => {
              delete ret._id;
              return ret;
            }
          }
        },
        options
      )
    );
  }
};
