import api from '../utils/api';

const productService = {
  createProduct(product, photos, primaryPhotoIndex) {
    return api.postForm('/products', {...product, photos, primaryPhotoIndex});
  },
  updateProduct(product, productId, primaryPhotoIndex) {
    return api.putForm(`/products/${productId}`, {...product, primaryPhotoIndex});
  },
  deleteProduct(productId) {
    return api.delete(`/products/${productId}`);
  },
  getProducts({skip, limit}) {
    return api.get(`/products?skip=${skip}&limit=${limit}`);
  },
  getUserProducts(userId, {skip, limit}) {
    return api.get(`/products?user=${userId}&skip=${skip}&limit=${limit}`);
  },
  getProductById(productId) {
    return api.get(`/products/${productId}`);
  }
};

export default productService;
