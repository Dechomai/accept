import {
  CANCEL_EXCHANGE_REQUEST,
  CANCEL_EXCHANGE_SUCCESS,
  CANCEL_EXCHANGE_FAILURE
} from '../actions/exchanges';

const exchangeDetails = (state = {}, action) => {
  switch (action.type) {
    case CANCEL_EXCHANGE_REQUEST: {
      return {
        ...state,
        [action.payload.exchangeId]: {
          loading: true,
          error: null
        }
      };
    }
    case CANCEL_EXCHANGE_SUCCESS: {
      return {
        ...state,
        [action.payload.exchangeId]: {
          loading: false,
          error: null
        }
      };
    }
    case CANCEL_EXCHANGE_FAILURE: {
      return {
        ...state,
        [action.payload.exchangeId]: {
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

export default exchangeDetails;
