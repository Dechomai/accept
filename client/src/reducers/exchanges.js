import createReducer from '../utils/createReducer';

import {
  FETCH_EXCHANGES_REQUEST,
  FETCH_EXCHANGES_SUCCESS,
  FETCH_EXCHANGES_FAILURE,
  CANCEL_EXCHANGE_SUCCESS,
  ACCEPT_EXCHANGE_SUCCESS,
  REJECT_EXCHANGE_SUCCESS,
  VALIDATE_EXCHANGE_SUCCESS,
  REPORT_EXCHANGE_SUCCESS
} from '../actions/exchanges';

/*
  type State = {
    [state: string]: ScopeState
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
  // [state]: {}
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
  [FETCH_EXCHANGES_REQUEST](state) {
    return {
      ...state,
      loading: true
    };
  },
  [FETCH_EXCHANGES_SUCCESS](state, payload) {
    return {
      ...state,
      loading: false,
      error: null,
      data: payload.data,
      listValid: true
    };
  },
  [FETCH_EXCHANGES_FAILURE](state, payload) {
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

const actions = [FETCH_EXCHANGES_REQUEST, FETCH_EXCHANGES_SUCCESS, FETCH_EXCHANGES_FAILURE];

const invalidateActions = [
  CANCEL_EXCHANGE_SUCCESS,
  ACCEPT_EXCHANGE_SUCCESS,
  REJECT_EXCHANGE_SUCCESS,
  VALIDATE_EXCHANGE_SUCCESS,
  REPORT_EXCHANGE_SUCCESS
];

const exchanges = (state = getInitialState(), action) => {
  const {type} = action;

  if (invalidateActions.includes(type)) {
    return {
      ...state,
      ...invalidateState(state)
    };
  }

  if (!actions.includes(type)) return state;
  const {state: listState} = action;
  return {
    ...state,
    [listState]: meta(state[listState], action)
  };
};

const invalidateState = state => {
  const newState = {};
  for (let listState in state) {
    newState[listState] = {};
    for (let param in state[listState]) {
      if (param !== 'count') {
        newState[listState][param] = {
          ...state[listState][param],
          listValid: false
        };
      }
    }
  }
  return newState;
};

export default exchanges;
