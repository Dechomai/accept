// const logger = require('../../logger');
const cloudinary = require('../../integrations/cloudinary');

const mediaController = {
  uploadUserAvatar(userId, image) {
    return cloudinary.uploadImage(image.buffer, {
      id: userId,
      folder: 'users'
    });
  },
  uploadProductImages(productId, images) {
    return Promise.all(
      images.reduce(
        (acc, image) =>
          acc.concat([
            cloudinary.uploadImage(image.buffer, {id: image.id, folder: `products/${productId}`})
          ]),
        []
      )
    );
  },
  removeProductImages(productId, imageIds) {
    return Promise.all(
      imageIds.reduce(
        (acc, imageId) => acc.concat([cloudinary.removeImage(`products/${productId}/${imageId}`)]),
        []
      )
    );
  }
};

module.exports = mediaController;
