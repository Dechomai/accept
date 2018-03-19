const env = process.env.NODE_ENV || 'development';

const config = require(`./webpack/${env}.js`);

// output generated configuration
// console.log(JSON.stringify(config, null, 2));

module.exports = config;
