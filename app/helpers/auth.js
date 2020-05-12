const COOKIE_NAME = 'accesstoken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  signed: true
};
module.exports.getTokenCookie = req => req.signedCookies[COOKIE_NAME];

module.exports.appendTokenCookie = (res, token) => res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

module.exports.clearTokenCookie = res => res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
