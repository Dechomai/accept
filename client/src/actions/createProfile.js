import userService from '../services/user';

export const CREATE_PROFILE_REQUEST = 'CREATE_PROFILE_REQUEST';
export const CREATE_PROFILE_SUCCESS = 'CREATE_PROFILE_SUCCESS';
export const CREATE_PROFILE_FAILURE = 'CREATE_PROFILE_FAILURE';

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
      error => dispatch(createProfileFailure(error))
    );
};
