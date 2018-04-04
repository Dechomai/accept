const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {paths} = require('./paths');

const extractScss = new MiniCssExtractPlugin({
  filename: '[name]_[hash].css'
});

const loaders = {
  babel: {
    test: /\.js$/,
    exclude: /node_modules/,
    use: 'babel-loader'
  },
  scss: {
    development: {
      test: /\.(scss|css)/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    },
    production: {
      test: /\.(scss|css)/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            minimize: {
              colormin: false
            }
          }
        },
        {loader: 'sass-loader'}
      ]
    }
  }
};

const plugins = {
  define: {
    development: new webpack.DefinePlugin({
      ENV: JSON.stringify('development'),
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    production: new webpack.DefinePlugin({
      ENV: JSON.stringify('production'),
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  },
  css: {
    production: extractScss
  },
  html: {
    development: new HtmlWebpackPlugin({
      template: path.join(paths.src, 'index.html'),
      ENV: 'development'
    }),
    production: new HtmlWebpackPlugin({
      template: path.join(paths.src, 'index.html'),
      ENV: 'production'
    })
  }
};

module.exports = {
  loaders,
  plugins
};
