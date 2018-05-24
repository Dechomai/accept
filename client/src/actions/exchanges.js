import exchangesService from '../services/exchange';
import metamaskService from '../services/metamask';

export const FETCH_EXCHANGES_REQUEST = 'FETCH_EXCHANGES_REQUEST';
export const FETCH_EXCHANGES_SUCCESS = 'FETCH_EXCHANGES_SUCCESS';
export const FETCH_EXCHANGES_FAILURE = 'FETCH_EXCHANGES_FAILURE';

export const CANCEL_EXCHANGE_REQUEST = 'CANCEL_EXCHANGE_REQUEST';
export const CANCEL_EXCHANGE_SUCCESS = 'CANCEL_EXCHANGE_SUCCESS';
export const CANCEL_EXCHANGE_FAILURE = 'CANCEL_EXCHANGE_FAILURE';

export const fetchExchangesRequest = ({state, skip, limit}) => ({
  type: FETCH_EXCHANGES_REQUEST,
  state,
  skip,
  limit,
  payload: {}
});

export const fetchExchangesSuccess = ({state, skip, limit}, data, count) => ({
  type: FETCH_EXCHANGES_SUCCESS,
  state,
  skip,
  limit,
  payload: {
    data,
    count
  }
});

export const fetchExchangesFailure = ({state, skip, limit}, error) => ({
  type: FETCH_EXCHANGES_FAILURE,
  state,
  skip,
  limit,
  payload: {
    error
  }
});

export const fetchExchanges = ({state, skip, limit}) => dispatch => {
  dispatch(fetchExchangesRequest({state, skip, limit}));

  return exchangesService
    .getExchanges({state, skip, limit})
    .then(
      data => dispatch(fetchExchangesSuccess({state, skip, limit}, data.exchanges, data.count)),
      err => Promise.reject(dispatch(fetchExchangesFailure({state, skip, limit}, err)))
    );
};

export const cancelExchangeRequest = exchangeId => ({
  type: CANCEL_EXCHANGE_REQUEST,
  payload: {
    exchangeId
  }
});

export const cancelExchangeSuccess = exchangeId => ({
  type: CANCEL_EXCHANGE_SUCCESS,
  payload: {
    exchangeId
  }
});

export const cancelExchangeFailure = (err, exchangeId) => ({
  type: CANCEL_EXCHANGE_FAILURE,
  payload: {
    err,
    exchangeId
  }
});

export const cancelExchange = ({exchange, user}) => dispatch => {
  const {id} = exchange;
  dispatch(cancelExchangeRequest(id));
  metamaskService
    .cancelExchangeContract({exchange, user})
    .then(
      txHash =>
        exchangesService
          .cancelExchange({exchangeId: exchange.id, bcTransactionHash: txHash})
          .then(
            () => dispatch(cancelExchangeSuccess(id)),
            err => dispatch(cancelExchangeFailure(err, id))
          ),
      err => dispatch(cancelExchangeFailure(err))
    );
};
