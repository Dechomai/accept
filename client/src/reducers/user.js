import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  CREATE_PROFILE_REQUEST,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from '../actions/user';

const getInitialState = () => ({
  loading: false,
  data: null,
  error: null
});

const user = (state = getInitialState(), action) => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case FETCH_PROFILE_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload.user,
        error: null
      };
    }
    case FETCH_PROFILE_FAILURE: {
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
    case UPDATE_PROFILE_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: {...state.data, ...action.payload.user},
        error: null
      };
    }
    case UPDATE_PROFILE_FAILURE: {
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

export default user;
