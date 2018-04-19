import api from '../utils/api';

const userService = {
  getUser(userId) {
    return api.get(`/user/${userId || ''}`);
  },
  createProfile(profile) {
    return api.post('/user', {
      body: profile
    });
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
  },
  uploadAvatar(avatar) {
    return api.postForm('/user', {avatar});
  }
};

export default userService;
