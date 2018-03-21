import {FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE} from '../actions/user';

const getInitialState = () => ({
  loading: false,
  user: null,
  error: null
});

const places = (state = getInitialState(), action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case FETCH_USER_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload.user,
        error: null
      };
    }
    case FETCH_USER_FAILURE: {
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
};

export default places;
