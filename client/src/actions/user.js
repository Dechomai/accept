import userService from '../services/user';

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST,
  payload: {}
});

export const fetchUserSuccess = user => ({
  type: FETCH_USER_SUCCESS,
  payload: {
    user
  }
});

export const fetchUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: {
    error
  }
});

export const fetchUser = () => dispatch => {
  dispatch(fetchUserRequest());
  return userService
    .getUser()
    .then(res => dispatch(fetchUserSuccess(res.user)), err => dispatch(fetchUserFailure(err)));
};
