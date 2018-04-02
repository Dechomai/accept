import api from '../utils/api';

const userService = {
  getUser() {
    return api.get('/user');
  },
  createProfile(profile) {
    return api.post('/user', {
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
    return api.uploadFiles('/user', {avatar});
  }
};

export default userService;
