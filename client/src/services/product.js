import api from '../utils/api';
import {assoc, addIndex, map} from 'ramda';

const productService = {
  createProduct(product, files, primaryPhotoIndex) {
    return this.uploadPhotos({photos: files}, {photosFolder: product.photosFolder}).then(result => {
      return api.post('/products', {
        body: assoc(
          'photos',
          addIndex(map)(
            (uri, index) => ({
              uri,
              primary: index === primaryPhotoIndex
            }),
            result.imageUri
          ),
          product
        )
      });
    });
  },
  uploadPhotos(files, photosFolder) {
    return api.uploadFiles('/product', files, photosFolder);
  },
  getProducts(limit, skip) {
    return api.get('/products', {
      body: {
        limit,
        skip
      }
    });
  },
  getUserProducts(userId, limit, skip) {
    return api.get('/products', {
      body: {
        user: userId,
        limit,
        skip
      }
    });
  }
};

export default productService;
