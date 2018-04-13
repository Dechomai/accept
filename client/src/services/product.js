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
  getProducts(skip, limit) {
    return api.get(`/products?skip=${skip}&limit=${limit}`);
  },
  getUserProducts(userId, skip, limit) {
    return api.get(`/products?user=${userId}&skip=${skip}&limit=${limit}`);
  },
  getProductById(productId) {
    return api.get(`/products/${productId}`);
  }
};

export default productService;
