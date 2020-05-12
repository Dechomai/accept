const multer = require('multer');
const {createLoggerWith} = require('../logger');
const {sendError} = require('../helpers/response');
const {is} = require('ramda');

const defaultLogger = createLoggerWith('[MDLWR:Upload]');

const IMAGES_MIME_TYPES = /image\/(png|gif|jpeg)/;

const handler = (err, req, res, next, {logger, logPrefix, mimetypes, required}) => {
  if (err) {
    logger.error(logPrefix, err);
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      logger.error(logPrefix, 'LIMIT_UNEXPECTED_FILE', err);
      return sendError(res, {message: 'Invalid request'}, {status: 400});
    }
    logger.error(logPrefix, 'Unknown error', err);
    return sendError(res, {message: 'Error processing request'}, {status: 400});
  }

  let {files, file} = req;
  if (!files && !file) {
    if (required) {
      return sendError(res, {message: 'File not provided'}, {status: 400});
    }
    return next();
  }
  if (!files && file) files = [file];
  if (mimetypes && is(RegExp, mimetypes) && files.some(file => !mimetypes.test(file.mimetype))) {
    logger.error(logPrefix, 'Invalid file type');
    return sendError(
      res,
      {message: 'Invalid file type. Only png, gif, jpeg are supported'},
      {status: 400}
    );
  }
  next();
};

const createUploadMiddleware = type => ({field, maxCount}, opts) => ({
  logger: customLogger,
  logPrefix: customLogPrefix,
  mimetypes = IMAGES_MIME_TYPES,
  required = false
} = {}) => {
  const upload = multer(opts)[type](field, maxCount);

  const logger = customLogger || defaultLogger;
  const logPrefix = customLogPrefix || `upload[${type}]`;

  return (req, res, next) => {
    upload(req, res, err => {
      handler(err, req, res, next, {logger, logPrefix, mimetypes, required});
    });
  };
};

module.exports = {
  createSingleUploadMiddleware: createUploadMiddleware('single'),
  createArrayUploadMiddleware: createUploadMiddleware('array')
};
