import api from '../utils/api';

const userService = {
  getUser() {
    return api.get('/user');
  }
};

export default userService;
