const {validationResult} = require('express-validator/check');
const {sendError} = require('../helpers/response');

const errorFormatter = ({/* location, */ msg /* , param, value, nestedErrors */}) => ({
  message: msg
});

module.exports = (...middlewares) => [
  ...middlewares,
  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return sendError(
        res,
        {
          message: 'Validation error',
          errors: errors.mapped()
        },
        {status: 422}
      );
    }
    next();
  }
];
