const {sendError} = require('../helpers/response');

const uploadErrorHandler = (logger, logPrefix, allowedTypesRegExp) => (err, req, res, next) => {
  if (err) {
    logger.error(logPrefix, err);
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      logger.error(logPrefix, 'LIMIT_UNEXPECTED_FILE', err);
      return sendError(res, {message: 'Invalid request'}, {status: 400});
    }
    logger.error(logPrefix, 'Unknown error', err);
    return sendError(res, {message: 'Error processing request'}, {status: 400});
  }
  if (allowedTypesRegExp && req.files.some(file => !allowedTypesRegExp.test(file.mimetype))) {
    logger.error(logPrefix, 'Invalid file type');
    return sendError(
      res,
      {message: 'Invalid file type. Only png, gif, jpeg are supported'},
      {status: 400}
    );
  }
  next();
};

module.exports = uploadErrorHandler;
