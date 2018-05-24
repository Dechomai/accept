import {
  CANCEL_EXCHANGE_REQUEST,
  CANCEL_EXCHANGE_SUCCESS,
  CANCEL_EXCHANGE_FAILURE
} from '../actions/exchanges';

const exchangeProcessing = (state = {}, action) => {
  switch (action.type) {
    case CANCEL_EXCHANGE_REQUEST: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case CANCEL_EXCHANGE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }
    case CANCEL_EXCHANGE_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
};

export default exchangeProcessing;
