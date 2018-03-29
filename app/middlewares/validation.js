const {validationResult} = require('express-validator/check');

const errorFormatter = ({/* location, */ msg /* , param, value, nestedErrors */}) => ({
  message: msg
});

module.exports = (...middlewares) => [
  ...middlewares,
  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.mapped()});
    }
    next();
  }
];
