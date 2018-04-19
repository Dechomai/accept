import createReducer from '../utils/createReducer';

import {FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE} from '../actions/users';

const getInitialUserState = () => ({
  loading: false,
  error: null,
  data: null
});

const user = createReducer(getInitialUserState(), {
  [FETCH_USER_REQUEST](state) {
    return {
      ...state,
      loading: true
    };
  },
  [FETCH_USER_SUCCESS](state, payload) {
    const {user} = payload;
    return {
      ...state,
      loading: false,
      data: user,
      error: null
    };
  },
  [FETCH_USER_FAILURE](state, payload) {
    return {
      ...state,
      loading: false,
      data: null,
      error: payload.error
    };
  }
});

const actions = [FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE];

const users = (state = {}, action) => {
  if (!actions.includes(action.type)) return state;

  const {userId} = action;
  return {
    ...state,
    [userId]: user(state[userId], action)
  };
};

export default users;
