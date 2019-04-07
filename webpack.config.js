var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'apireq.js',
    library: 'apireq',
    libraryTarget: 'umd'
  }
};
