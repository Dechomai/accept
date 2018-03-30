// const logger = require('../../logger');
const cloudinary = require('../../integrations/cloudinary');

const mediaController = {
  uploadUserAvatar(userId, image) {
    return cloudinary.uploadImage(image, {
      name: userId,
      folder: 'user'
    });
  }
};

module.exports = mediaController;
