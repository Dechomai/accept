const cognito = require('../integrations/cognito');

// Right now working as a facade over "integration"
const authService = {
  getLoginUri() {
    return cognito.getLoginUri();
  },
  getLogoutUri() {
    return cognito.getLogoutUri();
  },
  getTokenByCode(code) {
    return cognito.getTokensByCode(code);
  },
  updateToken(refreshToken) {
    return cognito.refreshToken(refreshToken);
  },
  validateToken(token) {
    return cognito.isTokenValid(token);
  }
};

module.exports = authService;
