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
  uploadImage(image, options = {}) {
    return new Promise((resolve, reject) => {
      const {name, folder, ...opts} = options;
      if (image instanceof Buffer) {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder,
              public_id: name,
              ...opts
            },
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          )
          .end(image);
      } else {
        cloudinary.v2.uploader.upload(
          image,
          {
            folder,
            public_id: name,
            ...opts
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      }
    });
  }
};

module.exports = cloudinaryIntegration;
