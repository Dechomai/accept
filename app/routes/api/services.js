const express = require('express');
const {body, query, param} = require('express-validator/check');
const {isUUID} = require('validator');
const {pick} = require('ramda');
const {createLoggerWith} = require('../../logger');
const {sendSuccess, sendError} = require('../../helpers/response');
const servicesController = require('../../controllers/api/services');
const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const {createArrayUploadMiddleware} = require('../../middlewares/upload');

const logger = createLoggerWith('[RTR]:Services');

const PATH = '/services';

const DEFAULT_LIMIT = 30; // TODO: move to configuration or smth

const servicesRouter = express.Router();

servicesRouter
  .route('/')
  .get(
    validationMiddleware(
      query('limit')
        .optional()
        .isInt({min: 1, max: 100})
        .toInt(),
      query('skip')
        .optional()
        .isInt({min: 0})
        .isInt()
        .toInt(),
      query('user')
        .optional()
        .custom(value => isUUID(value) || value === 'current')
    ),
    (req, res) => {
      const {user, limit = DEFAULT_LIMIT, skip = 0} = req.query;

      new Promise(resolve => {
        if (!user) return resolve(null);
        if (user !== 'current') return resolve(user);
        authMiddleware(req, res, () => {
          resolve(req.userId);
        });
      }).then(user => {
        servicesController.getServices({userId: user, limit, skip}).then(
          ({services, count}) => sendSuccess(res, {limit, skip, count, services}),
          err => {
            if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
            sendError(res, {message: 'Error getting services'});
          }
        );
      });
    }
  )
  .post(
    authMiddleware,
    createArrayUploadMiddleware({field: 'photos', maxCount: 8})({
      logger,
      logPrefix: 'post:services'
    }),
    validationMiddleware(
      body('title')
        .exists()
        .isLength({min: 3, max: 400}),
      body('video')
        .optional({
          checkFalsy: true
        })
        .isURL(),
      body('description')
        .exists()
        .isLength({min: 10, max: 800}),
      body('price')
        .exists()
        .isFloat({min: 0, max: 2000000})
    ),
    (req, res) => {
      const {userId, files} = req;
      const data = pick(['title', 'video', 'description', 'price', 'primaryPhotoIndex'], req.body);
      return servicesController
        .addService(data, files, userId)
        .then(
          service => sendSuccess(res, {service}),
          error => sendError(res, {message: error || 'Error creating service'})
        );
    }
  );

servicesRouter
  .route('/:serviceId')
  .all(
    validationMiddleware(
      param('serviceId')
        .exists()
        .isUUID()
    )
  )
  .get((req, res) => {
    const {serviceId} = req.params;
    servicesController.getService(serviceId).then(
      service => sendSuccess(res, {service}),
      err => {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: 'Error getting service'});
      }
    );
  })
  .put(
    authMiddleware,
    createArrayUploadMiddleware({field: 'newPhotos', maxCount: 8})({
      logger,
      logPrefix: 'post:services'
    }),
    (req, res, next) => {
      if (typeof req.body.removedPhotos === 'string') {
        req.body.removedPhotos = [req.body.removedPhotos];
      }
      next();
    },
    validationMiddleware(
      body('title')
        .optional()
        .isLength({min: 3, max: 400}),
      body('video')
        .optional({
          checkFalsy: true
        })
        .isURL(),
      body('description')
        .optional()
        .isLength({min: 10, max: 800}),
      body('price')
        .optional()
        .isFloat({min: 0, max: 2000000}),
      body('removedPhotos.*')
        .optional()
        .isUUID()
    ),
    async (req, res) => {
      const {userId, files: newPhotos} = req;
      const {serviceId} = req.params;
      const data = pick(['title', 'video', 'description', 'price', 'primaryPhotoIndex'], req.body);
      const {removedPhotos = []} = req.body;
      try {
        const ownedService = await servicesController.isServiceOwner(userId, serviceId);
        if (!ownedService) {
          return sendError(
            res,
            {message: 'Current user is not owner of this service'},
            {status: 403}
          );
        }
        try {
          const service = await servicesController.editService(
            ownedService,
            data,
            newPhotos,
            removedPhotos
          );
          sendSuccess(res, {service});
        } catch (err) {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: typeof err === 'string' ? err : 'Error editing services'});
        }
      } catch (err) {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: 'Error checking service ownership'});
      }
    }
  )
  .delete(authMiddleware, async (req, res) => {
    const {userId} = req;
    const {serviceId} = req.params;
    try {
      const service = await servicesController.isServiceOwner(userId, serviceId);
      if (!service) {
        return sendError(
          res,
          {message: 'Current user is not owner of this service'},
          {status: 403}
        );
      }
      try {
        await servicesController.removeService(service);
        sendSuccess(res);
      } catch (err) {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: typeof err === 'string' ? err : 'Error removing service'});
      }
    } catch (err) {
      if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
      sendError(res, {message: 'Error checking service ownership'});
    }
  });

module.exports = app => {
  app.use(PATH, servicesRouter);
};
