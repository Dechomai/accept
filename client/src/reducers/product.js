import {
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE
} from '../actions/product';

const getInitialState = () => ({
  loading: false,
  data: null,
  error: null
});

const product = (state = getInitialState(), action) => {
  switch (action.type) {
    case CREATE_PRODUCT_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case CREATE_PRODUCT_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload.product,
        error: null
      };
    }
    case CREATE_PRODUCT_FAILURE: {
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
};

export default product;
