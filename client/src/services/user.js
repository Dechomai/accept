import api from '../utils/api';

const userService = {
  getUser() {
    return api.get('/user');
  },
  createProfile(profile) {
    return api.post('/user', {
      body: profile
    });
  }
};

export default userService;
