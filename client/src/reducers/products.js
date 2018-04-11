import createReducer from '../utils/createReducer';

import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE
} from '../actions/products';

const getInitialState = () => ({
  all: {},
  user: {}
  // [userId]: {}
});

const getInitialListState = () => ({
  loading: false,
  error: null,
  data: [],
  count: 0,
  listValid: false
});

const list = createReducer(getInitialListState(), {
  [FETCH_PRODUCTS_REQUEST](state) {
    return {
      ...state,
      loading: true
    };
  },
  [FETCH_PRODUCTS_SUCCESS](state, payload) {
    return {
      ...state,
      loading: false,
      error: null,
      data: payload.data,
      count: payload.count,
      listValid: true
    };
  },
  [FETCH_PRODUCTS_FAILURE](state, payload) {
    return {
      ...state,
      loading: false,
      error: payload.error
    };
  }
});

const meta = (state = {}, action) => {
  const {skip, limit} = action;
  const params = `skip=${skip},limit=${limit}`;
  return {
    ...state,
    [params]: list(state[params], action)
  };
};

const actions = [FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE];

const invalidateActions = [
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE
];

const products = (state = getInitialState(), action) => {
  const {type} = action;

  if (invalidateActions.includes(type)) {
    return {
      ...state,
      all: invalidateState(state.all),
      user: invalidateState(state.user)
    };
  }

  if (!actions.includes(type)) return state;
  const {scope} = action;
  return {
    ...state,
    [scope]: meta(state[scope], action)
  };
};

const invalidateState = state => {
  const newState = {};
  for (let param in state) {
    newState[param] = {
      ...state[param],
      listValid: false
    };
  }
  return newState;
};

export default products;
