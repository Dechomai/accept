module.exports.atob = str => Buffer.from(str, 'utf8').toString('base64');
module.exports.btoa = str => Buffer.from(str, 'base64').toString('utf8');
