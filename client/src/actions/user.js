import userService from '../services/user';

export const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';

export const CREATE_PROFILE_REQUEST = 'CREATE_PROFILE_REQUEST';
export const CREATE_PROFILE_SUCCESS = 'CREATE_PROFILE_SUCCESS';
export const CREATE_PROFILE_FAILURE = 'CREATE_PROFILE_FAILURE';

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

// FETCH USER
export const fetchProfileRequest = () => ({
  type: FETCH_PROFILE_REQUEST,
  payload: {}
});

export const fetchProfileSuccess = user => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: {
    user
  }
});

export const fetchProfileFailure = error => ({
  type: FETCH_PROFILE_FAILURE,
  payload: {
    error
  }
});

export const fetchProfile = () => dispatch => {
  dispatch(fetchProfileRequest());
  return userService
    .getUser()
    .then(
      res => dispatch(fetchProfileSuccess(res.user)),
      err => Promise.reject(dispatch(fetchProfileFailure(err)))
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
  const avatarUpload = profile.avatar
    ? userService.uploadAvatar(profile.avatar)
    : Promise.resolve({});

  return avatarUpload
    .then(({imageUri}) => {
      delete profile['avatar'];
      if (imageUri) profile['photoUrl'] = imageUri;
      return userService.createProfile(profile);
    })
    .then(
      data => dispatch(createProfileSuccess(data.user)),
      err => Promise.reject(dispatch(createProfileFailure(err)))
    );
};

// UPDATE USER
export const updateProfileRequest = () => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: {}
});

export const updateProfileSuccess = user => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: {
    user
  }
});

export const updateProfileFailure = error => ({
  type: UPDATE_PROFILE_FAILURE,
  payload: {
    error
  }
});

export const updateProfile = profile => dispatch => {
  dispatch(createProfileRequest());

  return userService
    .updateProfile(profile)
    .then(
      data => dispatch(updateProfileSuccess(data.user)),
      err => Promise.reject(dispatch(updateProfileFailure(err)))
    );
};
