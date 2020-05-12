import userService from '../services/user';

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

// FETCH USER
export const fetchUserRequest = userId => ({
  type: FETCH_USER_REQUEST,
  userId,
  payload: {}
});

export const fetchUserSuccess = (user, userId) => ({
  type: FETCH_USER_SUCCESS,
  userId,
  payload: {
    user
  }
});

export const fetchUserFailure = (error, userId) => ({
  type: FETCH_USER_FAILURE,
  userId,
  payload: {
    error
  }
});

export const fetchUser = userId => dispatch => {
  dispatch(fetchUserRequest(userId));
  return userService.getUser(userId).then(
    res => dispatch(fetchUserSuccess(res.user, userId)),
    err => Promise.reject(dispatch(fetchUserFailure(err, userId)))
  );
};
