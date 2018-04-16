const express = require('express');
const multer = require('multer');
const {createLoggerWith} = require('../../logger');
const mediaController = require('../../controllers/api/media');
const {sendError, sendSuccess} = require('../../helpers/response');

const logger = createLoggerWith('[RTR]:Media');

const PATH = '/media';

const upload = multer({includeEmptyFields: true});

const mediaRouter = express.Router();
const uploadRouter = express.Router();

uploadRouter
  .post('/user', (req, res) => {
    upload.single('avatar')(req, res, err => {
      if (err) {
        logger.error('post:user', err);
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          logger.error('post:user', 'Invalid filename', err);
          return sendError(res, {message: 'Invalid filename'}, {status: 400});
        }
        logger.error('post:user', 'Unknown error', err);
        return sendError(res, {message: 'Error parsing file'}, {status: 400});
      }
      const {file} = req;
      if (!/image\/(png|gif|jpeg)/.test(file.mimetype)) {
        logger.error('post:user', 'Invalid file type', err);
        return sendError(
          res,
          {message: 'Invalid file type. Only png, gif, jpeg are supported'},
          {status: 415}
        );
      }
      const {userId} = req;
      mediaController.uploadUserAvatar(userId, file.buffer).then(
        result => {
          logger.info('post:user', 'Image uploaded', result);
          sendSuccess(res, {imageUri: result.url});
        },
        err => {
          logger.error('post:user', 'Error uploading image', err);
          sendError(res, {message: 'Error uploading image'}, {status: 400});
        }
      );
    });
  })
  .post('/service', (req, res) => {
    res.send('upload service picture');
  });

mediaRouter.use('/upload', uploadRouter);

module.exports = app => {
  app.use(PATH, mediaRouter);
};
