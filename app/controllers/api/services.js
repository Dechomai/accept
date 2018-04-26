const {dissoc, path, zip} = require('ramda');
const uuidv4 = require('uuid/v4');
const Service = require('../../models/service');
const User = require('../../models/user');
const {createLoggerWith} = require('../../logger');
const mediaController = require('./media');
const {getVideoId} = require('../../helpers/youtube');

const logger = createLoggerWith('[CTRL:Services]');

const DEFAULT_SORT = {
  createdAt: -1
};

const mapPhotoToDbModel = ({id, url}) => ({_id: id, url});

const serviceController = {
  isServiceOwner(userId, serviceId) {
    return Service.findById(serviceId)
      .then(service => {
        if (!service) return Promise.reject(null);
        logger.info(':isServiceOwner', `${serviceId} found`, service.toJSON());
        const isOwner = service.createdBy === userId;
        if (isOwner) {
          logger.info(
            ':isServiceOwner',
            `User ${userId} is ${isOwner ? '' : 'not '}owner of ${serviceId}`
          );
        }
        return isOwner ? service : null;
      })
      .catch(err => {
        if (err === null) {
          logger.error(':isServiceOwner', `${serviceId} not found`);
        } else {
          logger.error(':isServiceOwner', `${serviceId} error`, err);
        }
        return Promise.reject(err);
      });
  },

  getServices({userId, limit, skip}) {
    const query = {status: 'active'};
    if (userId) query.createdBy = userId;

    return Promise.all([
      Service.find(query, Service.projection, {limit, skip, sort: DEFAULT_SORT}),
      Service.count(query)
    ])
      .then(([services, count = 0]) => {
        logger.info(
          ':getServices',
          `(limit:${limit},skip:${skip}) found ${services.length}, total ${count}`,
          userId && `for user ${userId}`
        );
        return {services, count};
      })
      .catch(err => {
        logger.error(
          ':getServices',
          `(limit:${limit},skip:${skip}) error`,
          userId && `for user ${userId}`,
          err
        );
        return Promise.reject(err);
      });
  },

  getService(id) {
    return Service.findOne({_id: id, status: 'active'}, Service.projection)
      .populate('createdBy', User.publicProjection)
      .then(service => (service ? service.toJSON() : Promise.reject(null)))
      .then(service => {
        logger.info(':getService', `${id} found`, service);
        return service;
      })
      .catch(err => {
        if (err === null) {
          logger.error(':getService', `${id} not found`);
        } else {
          logger.error(':getService', `${id} error`, err);
        }
        return Promise.reject(err);
      });
  },

  addService(data, images, userId) {
    const id = uuidv4();

    const photosToUpload = images.map(file => ({id: uuidv4(), buffer: file.buffer}));
    const primaryPhotoIndex = parseInt(data.primaryPhotoIndex) || 0;
    const primaryPhotoId = path([primaryPhotoIndex, 'id'], photosToUpload);

    return mediaController
      .uploadServiceImages(id, photosToUpload)
      .then(
        results => {
          logger.info('post:services', 'Images uploaded', results);
          return results.map(mapPhotoToDbModel);
        },
        err => {
          logger.error('post:services', 'Error uploading images', err);
          return Promise.reject('Error uploading images to cloud');
        }
      )
      .then(photos =>
        Service.create({
          ...dissoc('primaryPhotoIndex', data),
          _id: id,
          createdBy: userId,
          photos,
          primaryPhotoId,
          video: getVideoId(data.video)
        })
      )
      .then(service => {
        logger.info(':addService', `created ${service.id}`, service.toJSON());
        return service;
      })
      .then(service =>
        User.findById(userId, User.publicProjection).then(user => {
          service.createdBy = user;
          return service;
        })
      )
      .then(service => service.toJSON())
      .catch(err => {
        logger.error(':addService', 'error', err);
        return Promise.reject(err);
      });
  },

  editService(service, data, newPhotos, removedPhotos) {
    if (service.status === 'deleted') return Promise.reject(null);

    const photosToUpload = newPhotos.map(file => ({id: uuidv4(), buffer: file.buffer}));
    const primaryPhotoIndex = parseInt(data.primaryPhotoIndex) || 0;

    return mediaController
      .removeServiceImages(service.id, removedPhotos)
      .then(results => {
        const imageRemoveStatuses = zip(removedPhotos, results);
        imageRemoveStatuses.forEach(([photoId, {result}]) => {
          logger.info(':editService', `Photo ${photoId} remove status is: ${result}`);
        });
        return mediaController.uploadServiceImages(service.id, photosToUpload);
      })
      .then(
        results => {
          logger.info('put:services', 'Images uploaded', results);
          return results.map(mapPhotoToDbModel);
        },
        err => {
          logger.error('put:services', 'Error uploading images', err);
          return Promise.reject('Error uploading images to cloud');
        }
      )
      .then(uploadedPhotos => {
        const remainingPhotos = service.photos.filter(photo => !removedPhotos.includes(photo.id));
        const photos = [...remainingPhotos, ...uploadedPhotos];
        const primaryPhoto = photos[primaryPhotoIndex] || photos[0];
        const primaryPhotoId = primaryPhoto ? primaryPhoto._id : null;

        return Service.findByIdAndUpdate(
          service.id,
          {
            ...data,
            photos,
            primaryPhotoId,
            video: getVideoId(data.video)
          },
          {new: true}
        ).populate('createdBy', User.publicProjection);
      })
      .then(product => {
        logger.info(':editService', `edited ${product.id}`, product.toJSON());
        return product.toJSON();
      })
      .catch(err => {
        logger.error(':editService', 'error', err);
        return Promise.reject(err);
      });
  },

  removeService(service) {
    if (service.status === 'deleted') return Promise.reject(null);

    const photosToRemove = service.photos.map(photo => photo.id);

    return mediaController
      .removeServiceImages(service.id, photosToRemove)
      .then(results => {
        const imageRemoveStatuses = zip(photosToRemove, results);
        imageRemoveStatuses.forEach(([photoId, {result}]) => {
          logger.info(':removeService', `Photo ${photoId} remove status is: ${result}`);
        });

        return Service.findByIdAndUpdate(service.id, {
          status: 'deleted'
        });
      })
      .then(service => {
        logger.info(':removeService', `removed ${service.id}`);
      })
      .catch(err => {
        logger.error(':removeService', 'error', err);
        return Promise.reject(err);
      });
  }
};

module.exports = serviceController;
