const express = require('express');
const multer = require('multer');
const {createLoggerWith} = require('../../logger');
const mediaController = require('../../controllers/api/media');

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
          return res.status(400).send({status: 'error', message: 'Invalid filename'});
        }
        logger.error('post:user', 'Unknown error', err);
        return res.status(400).send({status: 'error', message: 'Error parsing file'});
      }
      const {file} = req;
      if (!/image\/(png|gif|jpeg)/.test(file.mimetype)) {
        logger.error('post:user', 'Invalid file type', err);
        return res.status(400).send({
          status: 'error',
          message: 'Invalid file type. Only png, gif, jpeg are supported'
        });
      }
      const {userId} = req;
      mediaController.uploadUserAvatar(userId, file.buffer).then(
        result => {
          logger.info('post:user', 'Image uploaded', result);
          res.status(200).send({status: 'success', imageUri: result.url});
        },
        err => {
          logger.error('post:user', 'Error uploading image', err);
          res.status(400).send({
            status: 'error',
            message: 'Error uploading image'
          });
        }
      );
    });
  })
  .post('/product', (req, res) => {
    res.send('upload product picture');
  })
  .post('/service', (req, res) => {
    res.send('upload service picture');
  });

mediaRouter.use('/upload', uploadRouter);

module.exports = app => {
  app.use(PATH, mediaRouter);
};
