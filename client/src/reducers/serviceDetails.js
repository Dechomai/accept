import {
  FETCH_SERVICE_DETAILS_REQUEST,
  FETCH_SERVICE_DETAILS_SUCCESS,
  FETCH_SERVICE_DETAILS_FAILURE,
  UPDATE_SERVICE_REQUEST,
  UPDATE_SERVICE_SUCCESS,
  UPDATE_SERVICE_FAILURE
} from '../actions/services';

const serviceDetails = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SERVICE_DETAILS_REQUEST: {
      return {
        ...state,
        [action.serviceId]: {
          loading: true,
          error: null
        }
      };
    }
    case FETCH_SERVICE_DETAILS_SUCCESS: {
      return {
        ...state,
        [action.serviceId]: {
          loading: false,
          error: null,
          data: action.payload.service
        }
      };
    }
    case FETCH_SERVICE_DETAILS_FAILURE: {
      return {
        ...state,
        [action.serviceId]: {
          loading: false,
          error: action.payload.error
        }
      };
    }
    case UPDATE_SERVICE_REQUEST: {
      return {
        ...state,
        [action.serviceId]: {
          ...state[action.serviceId],
          loading: true,
          error: null
        }
      };
    }
    case UPDATE_SERVICE_SUCCESS: {
      return {
        ...state,
        [action.serviceId]: {
          loading: false,
          error: null,
          data: action.payload.service
        }
      };
    }
    case UPDATE_SERVICE_FAILURE: {
      return {
        ...state,
        [action.serviceId]: {
          ...state[action.serviceId],
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

export default serviceDetails;
