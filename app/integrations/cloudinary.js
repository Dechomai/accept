const cloudinary = require('cloudinary');
const config = require('../../config');

const CLOUDINARY_CLOUD_NAME = config.get('cloudinary.name');
const CLOUDINARY_API_KEY = config.get('cloudinary.apiKey');
const CLOUDINARY_API_SECRET = config.get('cloudinary.apiSecret');

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const cloudinaryIntegration = {
  uploadImage(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const {id, folder, ...opts} = options;

      cloudinary.v2.uploader
        .upload_stream(
          {
            folder,
            public_id: id,
            ...opts
          },
          (err, result) => {
            if (err) return reject(err);
            resolve({...result, id});
          }
        )
        .end(buffer);
    });
  },
  removeImage(publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(publicId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
};

module.exports = cloudinaryIntegration;
