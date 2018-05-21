import exchangesService from '../services/exchange';

export const FETCH_EXCHANGES_REQUEST = 'FETCH_EXCHANGES_REQUEST';
export const FETCH_EXCHANGES_SUCCESS = 'FETCH_EXCHANGES_SUCCESS';
export const FETCH_EXCHANGES_FAILURE = 'FETCH_EXCHANGES_FAILURE';

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
