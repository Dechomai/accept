const merge = require('webpack-merge');

const {config} = require('./paths');
const {loaders, plugins} = require('./common');

module.exports = merge(config, {
  module: {
    rules: [loaders.babel, loaders.scss.production]
  },
  plugins: [
    plugins.define.production,
    plugins.css.production,
    plugins.html.production,
    plugins.bundleAnalyzer.production
  ]
});
