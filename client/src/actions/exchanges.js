import {toast} from 'react-toastify';

import exchangesService from '../services/exchange';
import metamaskService from '../services/metamask';

export const FETCH_EXCHANGES_REQUEST = 'FETCH_EXCHANGES_REQUEST';
export const FETCH_EXCHANGES_SUCCESS = 'FETCH_EXCHANGES_SUCCESS';
export const FETCH_EXCHANGES_FAILURE = 'FETCH_EXCHANGES_FAILURE';

export const CANCEL_EXCHANGE_REQUEST = 'CANCEL_EXCHANGE_REQUEST';
export const CANCEL_EXCHANGE_SUCCESS = 'CANCEL_EXCHANGE_SUCCESS';
export const CANCEL_EXCHANGE_FAILURE = 'CANCEL_EXCHANGE_FAILURE';

export const ACCEPT_EXCHANGE_REQUEST = 'ACCEPT_EXCHANGE_REQUEST';
export const ACCEPT_EXCHANGE_SUCCESS = 'ACCEPT_EXCHANGE_SUCCESS';
export const ACCEPT_EXCHANGE_FAILURE = 'ACCEPT_EXCHANGE_FAILURE';

export const REJECT_EXCHANGE_REQUEST = 'REJECT_EXCHANGE_REQUEST';
export const REJECT_EXCHANGE_SUCCESS = 'REJECT_EXCHANGE_SUCCESS';
export const REJECT_EXCHANGE_FAILURE = 'REJECT_EXCHANGE_FAILURE';

export const VALIDATE_EXCHANGE_REQUEST = 'VALIDATE_EXCHANGE_REQUEST';
export const VALIDATE_EXCHANGE_SUCCESS = 'VALIDATE_EXCHANGE_SUCCESS';
export const VALIDATE_EXCHANGE_FAILURE = 'VALIDATE_EXCHANGE_FAILURE';

export const REPORT_EXCHANGE_REQUEST = 'REPORT_EXCHANGE_REQUEST';
export const REPORT_EXCHANGE_SUCCESS = 'REPORT_EXCHANGE_SUCCESS';
export const REPORT_EXCHANGE_FAILURE = 'REPORT_EXCHANGE_FAILURE';

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

export const cancelExchangeFailure = (exchangeId, err) => ({
  type: CANCEL_EXCHANGE_FAILURE,
  payload: {
    err,
    exchangeId
  }
});

export const cancelExchange = ({exchange, user}) => dispatch => {
  const {id} = exchange;
  dispatch(cancelExchangeRequest(id));

  return metamaskService.cancelExchangeContract({exchange, user}).then(
    txHash =>
      exchangesService.cancelExchange({exchangeId: id, bcTransactionHash: txHash}).then(
        () => {
          toast.success('Transaction submitted');
          return dispatch(cancelExchangeSuccess(id));
        },
        err => dispatch(cancelExchangeFailure(id, err))
      ),
    err => {
      toast.error('Transaction rejected');
      dispatch(cancelExchangeFailure(id, err));
    }
  );
};

export const acceptExchangeRequest = exchangeId => ({
  type: ACCEPT_EXCHANGE_REQUEST,
  payload: {
    exchangeId
  }
});

export const acceptExchangeSuccess = exchangeId => ({
  type: ACCEPT_EXCHANGE_SUCCESS,
  payload: {
    exchangeId
  }
});

export const acceptExchangeFailure = (exchangeId, err) => ({
  type: ACCEPT_EXCHANGE_FAILURE,
  payload: {
    err,
    exchangeId
  }
});

export const acceptExchange = ({exchange, user}) => dispatch => {
  const {id} = exchange;
  dispatch(acceptExchangeRequest(id));

  return metamaskService
    .acceptExchangeContract({exchange, user})
    .then(
      txHash =>
        exchangesService
          .acceptExchange({exchangeId: id, bcTransactionHash: txHash})
          .then(
            () => dispatch(acceptExchangeSuccess(id)),
            err => dispatch(acceptExchangeFailure(id, err))
          ),
      err => dispatch(acceptExchangeFailure(id, err))
    );
};

export const rejectExchangeRequest = exchangeId => ({
  type: REJECT_EXCHANGE_REQUEST,
  payload: {
    exchangeId
  }
});

export const rejectExchangeSuccess = exchangeId => ({
  type: REJECT_EXCHANGE_SUCCESS,
  payload: {
    exchangeId
  }
});

export const rejectExchangeFailure = (exchangeId, err) => ({
  type: REJECT_EXCHANGE_FAILURE,
  payload: {
    err,
    exchangeId
  }
});

export const rejectExchange = ({exchange, user}) => dispatch => {
  const {id} = exchange;
  dispatch(rejectExchangeRequest(id));

  return metamaskService.rejectExchangeContract({exchange, user}).then(
    txHash =>
      exchangesService.rejectExchange({exchangeId: id, bcTransactionHash: txHash}).then(
        () => {
          toast.success('Transaction submitted');
          return dispatch(rejectExchangeSuccess(id));
        },
        err => dispatch(rejectExchangeFailure(id, err))
      ),
    err => {
      toast.error('Transaction rejected');
      dispatch(rejectExchangeFailure(id, err));
    }
  );
};

export const validateExchangeRequest = exchangeId => ({
  type: VALIDATE_EXCHANGE_REQUEST,
  payload: {
    exchangeId
  }
});

export const validateExchangeSuccess = exchangeId => ({
  type: VALIDATE_EXCHANGE_SUCCESS,
  payload: {
    exchangeId
  }
});

export const validateExchangeFailure = (exchangeId, err) => ({
  type: VALIDATE_EXCHANGE_FAILURE,
  payload: {
    err,
    exchangeId
  }
});

export const validateExchange = ({exchange, user}) => dispatch => {
  const {id} = exchange;
  dispatch(validateExchangeRequest(id));

  return metamaskService.validateExchangeContract({exchange, user}).then(
    txHash =>
      exchangesService.validateExchange({exchangeId: id, bcTransactionHash: txHash}).then(
        () => {
          toast.success('Transaction submitted');
          return dispatch(validateExchangeSuccess(id));
        },
        err => dispatch(validateExchangeFailure(id, err))
      ),
    err => {
      toast.error('Transaction rejected');
      dispatch(validateExchangeFailure(id, err));
    }
  );
};

export const reportExchangeRequest = exchangeId => ({
  type: REPORT_EXCHANGE_REQUEST,
  payload: {
    exchangeId
  }
});

export const reportExchangeSuccess = exchangeId => ({
  type: REPORT_EXCHANGE_SUCCESS,
  payload: {
    exchangeId
  }
});

export const reportExchangeFailure = (exchangeId, err) => ({
  type: REPORT_EXCHANGE_FAILURE,
  payload: {
    err,
    exchangeId
  }
});

export const reportExchange = ({exchange, user}) => dispatch => {
  const {id} = exchange;
  dispatch(reportExchangeRequest(id));

  return metamaskService.reportExchangeContract({exchange, user}).then(
    txHash =>
      exchangesService.reportExchange({exchangeId: id, bcTransactionHash: txHash}).then(
        () => {
          toast.success('Transaction submitted');
          return dispatch(reportExchangeSuccess(id));
        },
        err => dispatch(reportExchangeFailure(id, err))
      ),
    err => {
      toast.error('Transaction rejected');
      dispatch(reportExchangeFailure(id, err));
    }
  );
};
