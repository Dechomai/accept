import api from '../utils/api';

const userService = {
  getUser(userId = '') {
    return api.get(`/user/${userId}`);
  },

  createProfile(profile) {
    return api.postForm('/user', profile);
  },

  updateProfile(profile) {
    return api.put('/user', {
      body: profile
    });
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
