module.exports.sendSuccess = (res, args, {status = 200} = {}) =>
  res.status(status).send({
    status: 'success',
    ...args
  });

module.exports.sendError = (res, args, {status = 500} = {}) =>
  res.status(status).send({
    status: 'error',
    ...args
  });
