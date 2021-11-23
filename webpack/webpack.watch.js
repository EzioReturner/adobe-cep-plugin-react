'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const paths = require('./paths');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const setting = require('../src/client/config/setting');

const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop');

const baseConfig = require('./webpack.base');

const { plugins, resolve: _resolve } = baseConfig;

module.exports = function () {
  return Object.assign(baseConfig, {
    mode: 'development',
    bail: false,
    entry: paths.appIndexJs,
    resolve: {
      ..._resolve,
      plugins: [
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson, reactRefreshOverlayEntry])
      ]
    },
    output: {
      publicPath: paths.servedPath,
      path: paths.distClientFolder,
      pathinfo: false,
      filename: 'js/bundle.js',
      chunkFilename: 'js/[name].chunk.js'
    },
    plugins: [
      ...plugins,
      new HtmlWebpackPlugin({
        filename: '../index.html',
        inject: true,
        template: paths.appHtml
      }),

      new InterpolateHtmlPlugin({
        NODE_ENV: 'development',
        PUBLIC_URL: '',
        SITE_NAME: setting.siteName
      }),

      new CaseSensitivePathsPlugin()
    ]
  });
};
