import productService from '../services/product';

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// const scope = 'all' | 'user' | 'userId';

export const fetchProductsRequest = (scope, skip, limit) => ({
  type: FETCH_PRODUCTS_REQUEST,
  scope,
  skip,
  limit,
  payload: {}
});
export const fetchProductsSuccess = (scope, skip, limit, data, count) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  scope,
  skip,
  limit,
  payload: {
    data,
    count
  }
});
export const fetchProductsFailure = (scope, skip, limit, error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  scope,
  skip,
  limit,
  payload: {
    error
  }
});

export const fetchProducts = (scope, skip, limit) => dispatch => {
  dispatch(fetchProductsRequest(scope, skip, limit));

  let productsPromise;

  switch (scope) {
    case 'all':
      productsPromise = productService.getProducts(skip, limit);
      break;
    case 'user':
      productsPromise = productService.getUserProducts('current', skip, limit);
      break;
    default:
      productsPromise = productService.getUserProducts(scope, skip, limit);
  }

  return productsPromise.then(
    data => dispatch(fetchProductsSuccess(scope, skip, limit, data.products, data.count)),
    err => Promise.reject(dispatch(fetchProductsFailure(scope, skip, limit, err)))
  );
};
