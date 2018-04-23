const {dissoc, nth, prop, compose, zip} = require('ramda');
const Product = require('../../models/product');
const User = require('../../models/user');
const {createLoggerWith} = require('../../logger');
const uuidv4 = require('uuid/v4');
const mediaController = require('./media');
const {getVideoId} = require('../../helpers/youtube');

const logger = createLoggerWith('[CTRL:Products]');

const DEFAULT_SORT = {
  createdAt: -1
};

const mapPhotoToDbModel = ({id, url}) => ({_id: id, url});

const productController = {
  isProductOwner(userId, productId) {
    return Product.findById(productId)
      .then(product => {
        logger.info(':isProductOwner', `${productId} found`, product.toJSON());
        const isOwner = product.createdBy === userId;
        if (product.createdBy === userId) {
          logger.info(
            ':isProductOwner',
            `User ${userId} is ${isOwner ? '' : 'not '}owner of ${productId}`
          );
          return isOwner ? product : null;
        }
      })
      .catch(err => {
        if (err === null) {
          logger.error(':isProductOwner', `${productId} not found`);
        } else {
          logger.error(':isProductOwner', `${productId} error`, err);
        }
        return Promise.reject(err);
      });
  },
  getProductsForUser(userId, {limit, skip}) {
    return Promise.all([
      Product.find({createdBy: userId, removed: {$ne: true}}, Product.projection, {
        limit,
        skip,
        sort: DEFAULT_SORT
      }),
      Product.count({createdBy: userId, removed: {$ne: true}})
    ])
      .then(([products, count]) => {
        if (!products.length) return Promise.reject(null);
        return [products, count];
      })
      .then(([products, count = 0]) => {
        logger.info(
          ':getProductsForUser',
          `(limit:${limit},skip:${skip}) found ${products.length},`,
          ` total ${count},`,
          ` for ${userId}`
        );
        return {products, count};
      })
      .catch(err => {
        if (err === null) {
          logger.error(
            ':getProductsForUser',
            `(limit:${limit},skip:${skip}) not found, for ${userId}`
          );
        } else {
          logger.error(
            ':getProductsForUser',
            `(limit:${limit},skip:${skip}) error, for ${userId}`,
            err
          );
        }
        return Promise.reject(err);
      });
  },

  getProducts({limit, skip}) {
    return Promise.all([
      Product.find({removed: {$ne: true}}, Product.projection, {limit, skip, sort: DEFAULT_SORT}),
      Product.count({removed: {$ne: true}})
    ])
      .then(([products, count]) => {
        if (!products.length) return Promise.reject(null);
        return [products, count];
      })
      .then(([products, count = 0]) => {
        logger.info(
          ':getProducts',
          `(limit:${limit},skip:${skip}) found ${products.length}, total ${count}`
        );
        return {products, count};
      })
      .catch(err => {
        if (err === null) {
          logger.error(':getProducts', `(limit:${limit},skip:${skip}) not found`);
        } else {
          logger.error(':getProducts', `(limit:${limit},skip:${skip}) error`, err);
        }
        return Promise.reject(err);
      });
  },

  getProduct(productId) {
    return Product.findById(productId, Product.projection)
      .populate('createdBy', User.publicProjection)
      .then(product => (product && !product.removed ? product.toJSON() : Promise.reject(null)))
      .then(product => {
        logger.info(':getProduct', `${productId} found`, product);
        return product;
      })
      .catch(err => {
        if (err === null) {
          logger.error(':getProduct', `${productId} not found`);
        } else {
          logger.error(':getProduct', `${productId} error`, err);
        }
        return Promise.reject(err);
      });
  },

  addProduct(productData, images, userId) {
    const productId = uuidv4();

    const photosToUpload = images.map(file => ({id: uuidv4(), buffer: file.buffer}));
    const primaryPhotoIndex = parseInt(productData.primaryPhotoIndex) || 0;
    const primaryPhotoId = compose(prop('id'), nth(primaryPhotoIndex))(photosToUpload);

    return mediaController
      .uploadProductImages(productId, photosToUpload)
      .then(
        results => {
          logger.info('post:products', 'Images uploaded', results);
          return results.map(({id, url}) => ({_id: id, url}));
        },
        err => {
          logger.error('post:products', 'Error uploading images', err);
          return Promise.reject('Error uploading images to cloud');
        }
      )
      .then(photos =>
        Product.create({
          ...dissoc('primaryPhotoIndex', productData),
          _id: productId,
          createdBy: userId,
          photos,
          primaryPhotoId,
          video: getVideoId(productData.video)
        })
      )
      .then(product => {
        logger.info(':addProduct', `created ${product.id}`, product.toJSON());
        return product;
      })
      .then(product =>
        User.findById(userId, User.publicProjection).then(user => {
          product.createdBy = user;
          return product;
        })
      )
      .then(product => product.toJSON())
      .catch(err => {
        logger.error(':addProduct', 'error', err);
        return Promise.reject(err);
      });
  },

  editProduct(product, productData, newPhotos, removedPhotos) {
    if (product.removed) return Promise.reject(null);

    const photosToUpload = newPhotos.map(file => ({id: uuidv4(), buffer: file.buffer}));
    const primaryPhotoIndex = parseInt(productData.primaryPhotoIndex) || 0;

    return mediaController
      .removeProductImages(product.id, removedPhotos)
      .then(results => {
        const imageRemoveStatuses = zip(removedPhotos, results);
        imageRemoveStatuses.forEach(([photoId, {result}]) => {
          logger.info(':editProduct', `Photo ${photoId} remove status is: ${result}`);
        });
        return mediaController.uploadProductImages(product.id, photosToUpload);
      })
      .then(
        results => {
          logger.info('post:products', 'Images uploaded', results);
          return results.map(mapPhotoToDbModel);
        },
        err => {
          logger.error('post:products', 'Error uploading images', err);
          return Promise.reject('Error uploading images to cloud');
        }
      )
      .then(uploadedPhotos => {
        const remainingPhotos = product.photos.filter(photo => !removedPhotos.includes(photo.id));
        const photos = [...remainingPhotos, ...uploadedPhotos];
        const primaryPhoto = photos[primaryPhotoIndex] || photos[0];
        const primaryPhotoId = primaryPhoto ? primaryPhoto._id : null;

        return Product.findByIdAndUpdate(
          product.id,
          {
            ...productData,
            photos,
            primaryPhotoId,
            video: getVideoId(productData.video)
          },
          {new: true}
        ).populate('createdBy', User.publicProjection);
      })
      .then(product => {
        logger.info(':editProduct', `edited ${product.id}`, product.toJSON());
        return product.toJSON();
      })
      .catch(err => {
        logger.error(':editProduct', 'error', err);
        return Promise.reject(err);
      });
  },

  removeProduct(product) {
    if (product.removed) return Promise.reject(null);

    return Product.findByIdAndUpdate(product.id, {
      removed: true
    })
      .then(product => {
        logger.info(':removeProduct', `removed ${product.id}`, product.toJSON());
        return product.toJSON();
      })
      .catch(err => {
        logger.error(':removeProduct', 'error', err);
        return Promise.reject(err);
      });
  }
};

module.exports = productController;
