import api from '../utils/api';

const productService = {
  createProduct(product) {
    return api.post('/products', {
      body: product
    });
  },
  uploadPhotos(files, photosFolder) {
    return api.uploadFiles('/product', files, photosFolder);
  }
};

export default productService;
