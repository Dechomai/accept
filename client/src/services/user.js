import api from '../utils/api';

const userService = {
  getUser() {
    return api.get('/user');
  },
  createProfile() {
    return api.post('/');
  }
};

export default userService;
