const { exec } = require('child_process');
const webpack = require('webpack');
const { ProgressPlugin } = require("webpack");

const environment = process.env.NODE_ENV;

module.exports = ({ index, config, watch }, callback) => {

  try {
    let webpackConfig = require(config);

    if (!Array.isArray(webpackConfig)) {
      webpackConfig = [webpackConfig];
    }

    const compiler = webpack(webpackConfig[index]);

    if (watch) {
      compiler.watch(true, (error, stats) => callback(error || null));
    } else {
      compiler.run((error, stats) => callback(error || null));
    }
  } catch(error) {
    callback(error);
  }

};