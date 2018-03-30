import {FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE} from '../actions/user';

import {
  CREATE_PROFILE_REQUEST,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAILURE
} from '../actions/createProfile';

const getInitialState = () => ({
  loading: false,
  data: null,
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
        data: null,
        error: action.payload.error
      };
    }
    case CREATE_PROFILE_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case CREATE_PROFILE_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload.user,
        error: null
      };
    }
    case CREATE_PROFILE_FAILURE: {
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

export default places;
