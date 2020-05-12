import api from '../utils/api';

class UserService {
  getUser(userId = '') {
    return api.get(
      `/user/${userId}`,
      {},
      {
        handleUnauthorizedError: false
      }
    );
  }

  createProfile(profile) {
    return api.postForm('/user', profile);
  }

  confirmProfile(data) {
    return api.post('/user/confirm', {
      body: data
    });
  }

  updateProfile(profile) {
    return api.putForm('/user', profile);
  }

  isUsernameUnique(username) {
    return api.post('/user/unique-username', {
      body: {
        username
      }
    });
  }

  getTestEther(address) {
    return fetch(`https://faucet.ropsten.be/donate/${address}`);
  }
}

export default new UserService();
