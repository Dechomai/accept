import api from '../utils/api';
import {assoc, addIndex, map} from 'ramda';

const productService = {
  createProduct(product, files) {
    return this.uploadPhotos({photos: files}, {photosFolder: product.photosFolder}).then(result => {
      return api.post('/products', {
        body: assoc(
          'photos',
          addIndex(map)(
            (uri, index) => ({
              uri,
              primary: index === 0
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
  }
};

export default productService;
