const path = require('path');

const SRC = path.resolve('./src');
const DIST = path.resolve('./build');
const REPORTS = path.resolve('./reports');

module.exports.paths = {
  src: SRC,
  dist: DIST,
  reports: REPORTS
};

module.exports.config = {
  entry: path.join(SRC, 'main.js'),
  output: {
    path: DIST,
    filename: '[name]_[hash].js',
    publicPath: '/'
  }
};
