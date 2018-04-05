// const logger = require('../../logger');
const cloudinary = require('../../integrations/cloudinary');

const mediaController = {
  uploadUserAvatar(userId, image) {
    return cloudinary.uploadImage(image, {
      name: userId,
      folder: 'users'
    });
  },
  uploadProductImages(folder, images) {
    return Promise.all(
      images.reduce(
        (acc, image) => acc.concat([cloudinary.uploadImage(image, {folder: `products/${folder}`})]),
        []
      )
    );
  }
};

module.exports = mediaController;
