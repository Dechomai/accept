// const logger = require('../../logger');
const cloudinary = require('../../integrations/cloudinary');

const USERS_FOLDER = 'users';
const PRODUCTS_FOLDER = 'products';
const SERVICES_FOLDER = 'services';

const mediaController = {
  uploadUserAvatar(userId, image) {
    return cloudinary.uploadImage(image.buffer, {
      id: userId,
      folder: USERS_FOLDER
    });
  },

  uploadItemImages(folder, itemId, images) {
    return Promise.all(
      images.reduce(
        (acc, image) =>
          acc.concat([
            cloudinary.uploadImage(image.buffer, {id: image.id, folder: `${folder}/${itemId}`})
          ]),
        []
      )
    );
  },

  uploadProductImages(productId, images) {
    return this.uploadItemImages(PRODUCTS_FOLDER, productId, images);
  },

  uploadServiceImages(serviceId, images) {
    return this.uploadItemImages(SERVICES_FOLDER, serviceId, images);
  },

  removeItemImages(folder, itemId, imageIds) {
    return Promise.all(
      imageIds.reduce(
        (acc, imageId) => acc.concat([cloudinary.removeImage(`${folder}/${itemId}/${imageId}`)]),
        []
      )
    );
  },

  removeProductImages(productId, imageIds) {
    return this.removeItemImages(PRODUCTS_FOLDER, productId, imageIds);
  },

  removeServiceImages(serviceId, imageIds) {
    return this.removeItemImages(SERVICES_FOLDER, serviceId, imageIds);
  }
};

module.exports = mediaController;
