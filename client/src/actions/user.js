import userService from '../services/user';

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const CREATE_PROFILE_REQUEST = 'CREATE_PROFILE_REQUEST';
export const CREATE_PROFILE_SUCCESS = 'CREATE_PROFILE_SUCCESS';
export const CREATE_PROFILE_FAILURE = 'CREATE_PROFILE_FAILURE';

// FETCH USER
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
    .then(
      res => dispatch(fetchUserSuccess(res.user)),
      err => Promise.reject(dispatch(fetchUserFailure(err)))
    );
};

// CREATE USER
export const createProfileRequest = () => ({
  type: CREATE_PROFILE_REQUEST,
  payload: {}
});

export const createProfileSuccess = user => ({
  type: CREATE_PROFILE_SUCCESS,
  payload: {
    user
  }
});

export const createProfileFailure = error => ({
  type: CREATE_PROFILE_FAILURE,
  payload: {
    error
  }
});

export const createProfile = profile => dispatch => {
  dispatch(createProfileRequest());
  return userService
    .createProfile(profile)
    .then(
      data => dispatch(createProfileSuccess(data.user)),
      err => Promise.reject(dispatch(createProfileFailure(err)))
    );
};
