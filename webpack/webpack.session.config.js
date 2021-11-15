const path = require('path');
const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');
const DIST_FOLDER = paths.distFolder;
const SRC_FOLDER = paths.appSrc;
const SESSION_DIST_PATH = path.join(DIST_FOLDER, 'session-dist');
const SESSION_SRC_PATH = path.join(SRC_FOLDER, 'session-src');
const ENTRY_POINT_SESSION_PATH = path.join(SESSION_SRC_PATH, 'index.js');

module.exports = () => ({
  entry: ENTRY_POINT_SESSION_PATH,
  target: 'node',
  externals: [nodeExternals({ modulesDir: path.join(SESSION_SRC_PATH, 'node_modules') })],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          customize: require.resolve('babel-preset-react-app/webpack-overrides'),
          presets: [
            [
              require.resolve('babel-preset-react-app'),
              {
                runtime: 'automatic'
              }
            ]
          ],
          plugins: [
            [
              require.resolve('babel-plugin-named-asset-import'),
              {
                loaderMap: {
                  svg: {
                    ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]'
                  }
                }
              }
            ]
          ],
          cacheDirectory: true,
          cacheCompression: false,
          compact: false
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: SESSION_DIST_PATH,
    publicPath: '',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  plugins: []
});
