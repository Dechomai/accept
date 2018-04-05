import productService from '../services/product';

export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const createProductRequest = () => ({
  type: CREATE_PRODUCT_REQUEST,
  payload: {}
});

export const createProductSuccess = product => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: {
    product
  }
});

export const createProductFailure = error => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: {
    error
  }
});

export const createProduct = product => dispatch => {
  dispatch(createProductRequest());

  return productService
    .createProduct(product)
    .then(
      data => dispatch(createProductSuccess(data.product)),
      err => Promise.reject(dispatch(createProductFailure(err)))
    );
};
