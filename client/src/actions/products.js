import productService from '../services/product';

export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const UPDATE_PRODUCT_REQUEST = 'UPDATE_PRODUCT_REQUEST';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'UPDATE_PRODUCT_FAILURE';

export const DELETE_PRODUCT_REQUEST = 'DELETE_PRODUCT_REQUEST';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

// CREATE

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

export const createProduct = (product, files, primaryPhotoIndex) => dispatch => {
  dispatch(createProductRequest());

  return productService
    .createProduct(product, files, primaryPhotoIndex)
    .then(
      data => dispatch(createProductSuccess(data.product)),
      err => Promise.reject(dispatch(createProductFailure(err)))
    );
};

// FETCH LIST
// scope = 'all' | 'user' | userId;

export const fetchProductsRequest = ({scope, skip, limit}) => ({
  type: FETCH_PRODUCTS_REQUEST,
  scope,
  skip,
  limit,
  payload: {}
});
export const fetchProductsSuccess = ({scope, skip, limit}, data, count) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  scope,
  skip,
  limit,
  payload: {
    data,
    count
  }
});
export const fetchProductsFailure = ({scope, skip, limit}, error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  scope,
  skip,
  limit,
  payload: {
    error
  }
});

export const fetchProducts = ({scope, skip, limit}) => dispatch => {
  dispatch(fetchProductsRequest({scope, skip, limit}));

  let productsPromise;

  switch (scope) {
    case 'all':
      productsPromise = productService.getProducts({skip, limit});
      break;
    case 'user':
      productsPromise = productService.getUserProducts('current', {skip, limit});
      break;
    default:
      productsPromise = productService.getUserProducts(scope, {skip, limit});
  }

  return productsPromise.then(
    data => dispatch(fetchProductsSuccess({scope, skip, limit}, data.products, data.count)),
    err => Promise.reject(dispatch(fetchProductsFailure({scope, skip, limit}, err)))
  );
};
