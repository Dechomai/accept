const webpack = require('webpack');
const merge = require('webpack-merge');

const {paths, config} = require('./paths');
const {loaders, plugins} = require('./common');

module.exports = merge(config, {
  module: {
    rules: [loaders.babel, loaders.scss.development]
  },
  plugins: [
    plugins.define.development,
    plugins.html.development,
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    port: 7001,
    host: '0.0.0.0',
    historyApiFallback: true,
    contentBase: paths.src, // static files,
    disableHostCheck: true,
    proxy: [
      {
        context: pathname => {
          return [/^\/api/, /^\/login$/, /^\/logout$/, /^\/signup$/].some(regex =>
            regex.test(pathname)
          );
        },
        target: 'http://localhost:7000'
      }
    ]
  }
});
