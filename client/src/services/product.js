import api from '../utils/api';

const productService = {
  createProduct(product) {
    return api.post('/products', {
      body: product
    });
  }
};

export default productService;
