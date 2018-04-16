const {dissoc, nth, prop, compose} = require('ramda');
const Product = require('../../models/product');
const User = require('../../models/user');
const {createLoggerWith} = require('../../logger');
const uuidv4 = require('uuid/v4');
const mediaController = require('./media');

const logger = createLoggerWith('[CTRL:Products]');

const DEFAULT_SORT = {
  createdAt: -1
};

const productController = {
  getProductsForUser(userId, {limit, skip}) {
    return Promise.all([
      Product.find({createdBy: userId}, Product.projection, {limit, skip, sort: DEFAULT_SORT}),
      Product.count({createdBy: userId})
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
      Product.find({}, Product.projection, {limit, skip, sort: DEFAULT_SORT}),
      Product.count({})
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
      .then(product => (product ? product.toJSON() : Promise.reject(null)))
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

    const photos = images.map(file => ({id: uuidv4(), buffer: file.buffer}));
    const primaryPhotoIndex = parseInt(productData.primaryPhotoIndex) || 0;
    const primaryPhotoId = compose(prop('id'), nth(primaryPhotoIndex))(photos);

    return mediaController
      .uploadProductImages(productId, photos)
      .then(
        results => {
          logger.info('post:products', 'Images uploaded', results);
          return results.map(({id, url}) => ({_id: id, url}));
        },
        err => {
          logger.error('post:products', 'Error uploading images', err);
          //sendError(res, {message: 'Error uploading images'}, {status: 400});
        }
      )
      .then(photos =>
        Product.create({
          ...dissoc('primaryPhotoIndex', productData),
          _id: productId,
          createdBy: userId,
          photos,
          primaryPhotoId
        })
      )
      .then(product => {
        logger.info(':addProduct', `created ${product.id}`, product);
        return product.toJSON();
      })
      .catch(err => {
        logger.error(':addProduct', 'error', err);
        return Promise.reject(err);
      });
  }
};

module.exports = productController;
