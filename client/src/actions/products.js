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
