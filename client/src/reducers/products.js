import createReducer from '../utils/createReducer';

import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE
} from '../actions/products';

/*
  type State = {
    all: ScopeState,
    user: ScopeState,
    [userId: string]: ScopeState
  }

  type ScopeState = {
    count: number,
    [param: string]: ListState // param is "skip=0,limit=0"
  }

  type ListState = {
      loading: boolean,
      error: any,
      data: Array<any>,
      listValid: boolean
  }
*/

const getInitialState = () => ({
  all: {},
  user: {}
  // [userId]: {}
});

const getInitialScopeState = () => ({
  count: 0
});

const getInitialListState = () => ({
  loading: false,
  error: null,
  data: [],
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
      listValid: true
    };
  },
  [FETCH_PRODUCTS_FAILURE](state, payload) {
    return {
      ...state,
      loading: false,
      error: payload.error,
      listValid: true
    };
  }
});

const meta = (state = getInitialScopeState(), action) => {
  const {skip, limit} = action;
  const params = `skip=${skip},limit=${limit}`;
  return {
    ...state,
    count: action.payload.count || state.count,
    [params]: list(state[params], action)
  };
};

const actions = [FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE];

const invalidateActions = [
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
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
    if (param !== 'count') {
      newState[param] = {
        ...state[param],
        listValid: false
      };
    }
  }
  return newState;
};

export default products;
