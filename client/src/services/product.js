import api from '../utils/api';

const productService = {
  createProduct(product) {
    return api.post('/user', {
      body: product
    });
  }
};

export default productService;
