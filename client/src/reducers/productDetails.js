import {
  FETCH_PRODUCT_BY_ID_REQUEST,
  FETCH_PRODUCT_BY_ID_SUCCESS,
  FETCH_PRODUCT_BY_ID_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE
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
    case UPDATE_PRODUCT_REQUEST: {
      return {
        ...state,
        [action.productId]: {
          loading: true,
          error: null
        }
      };
    }
    case UPDATE_PRODUCT_SUCCESS: {
      return {
        ...state,
        [action.productId]: {
          loading: false,
          error: null,
          data: action.payload.product
        }
      };
    }
    case UPDATE_PRODUCT_FAILURE: {
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
