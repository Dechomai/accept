import {
  FETCH_PRODUCT_BY_ID_REQUEST,
  FETCH_PRODUCT_BY_ID_SUCCESS,
  FETCH_PRODUCT_BY_ID_FAILURE
} from '../actions/products';

const productDetails = (state = {}, action) => {
  switch (action.type) {
    case FETCH_PRODUCT_BY_ID_REQUEST: {
      return {
        ...state,
        [action.productId]: {
          loading: true,
          error: null
        }
      };
    }
    case FETCH_PRODUCT_BY_ID_SUCCESS: {
      return {
        ...state,
        [action.productId]: {
          loading: false,
          error: null,
          data: action.payload.product
        }
      };
    }
    case FETCH_PRODUCT_BY_ID_FAILURE: {
      return {
        ...state,
        [action.productId]: {
          loading: false,
          error: action.payload.error
        }
      };
    }
    default: {
      return state;
    }
  }
};

export default productDetails;
