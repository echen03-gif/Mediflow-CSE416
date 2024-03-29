const webpack = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
  const options = {
    webpackOptions: require('../webpack.config.js'), // Adjust this path as necessary
  };
  on('file:preprocessor', webpack(options));
};
