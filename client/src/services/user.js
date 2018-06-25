import api from '../utils/api';

const userService = {
  getUser(userId = '') {
    return api.get(
      `/user/${userId}`,
      {},
      {
        handleUnauthorizedError: false
      }
    );
  },

  createProfile(profile) {
    return api.postForm('/user', profile);
  },

  confirmProfile(data) {
    return api.post('/user/confirm', {
      body: data
    });
  },

  updateProfile(profile) {
    return api.putForm('/user', profile);
  },

  isUsernameUnique(username) {
    return api.post('/user/unique-username', {
      body: {
        username
      }
    });
  }
};

export default userService;
