'use strict';

const path = require('path');
const webpack = require('webpack');
// const resolve = require('resolve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
// const ESLintPlugin = require('eslint-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
// const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const paths = require('./paths');

const baseConfig = require('./webpack.base');
const setting = require('../src/client/config/setting');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const { original } = JSON.parse(process.env.npm_config_argv);
const useDll = original.includes('--dll');
const IsAnalyze = original.includes('--analyze');

const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop');

const { plugins, resolve: _resolve } = baseConfig;

module.exports = function () {
  const config = Object.assign(baseConfig, {
    mode: 'production',
    bail: true,
    devtool: 'cheap-module-source-map',
    entry: paths.appIndexJs,
    output: {
      publicPath: paths.servedPath,
      path: paths.distClientFolder,
      pathinfo: false,
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js'
    },
    resolve: {
      ..._resolve,
      plugins: [
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson, reactRefreshOverlayEntry])
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          sourceMap: shouldUseSourceMap
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  inline: false,
                  annotation: true
                }
              : false
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }]
          }
        })
      ],
      splitChunks: {
        chunks: 'initial', // 默认只对入口文件进行split chunks，使用 all 时会引起路由懒加载拆出过多子组件，增加请求数
        name: true,
        cacheGroups: {
          // 体积较大的chunk单独打包
          modelEditorLib: {
            chunks: 'async',
            test(module) {
              return /(highlight|react-color|antd)/.test(module.context);
            },
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 25
          },
          echarts: {
            chunks: 'async',
            test(module) {
              return /echarts/.test(module.context);
            },
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 20
          },
          // 入口共享chunks
          vendors: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
            name: 'vendors'
          },
          // 异步共享chunks
          'async-vendors': {
            chunks: 'async',
            test: /[\\/]node_modules[\\/]/,
            name: 'async-vendors',
            reuseExistingChunk: true,
            priority: 5
          },
          // RA组件chunks
          components: {
            chunks: 'all',
            test: path.join(__dirname, '..', './src/client/components'),
            name: 'components',
            minChunks: 2,
            reuseExistingChunk: true,
            priority: 7
          }
        }
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      }
    },

    plugins: [
      ...plugins,
      new HtmlWebpackPlugin({
        filename: '../index.html',
        template: paths.appHtml,
        minify: false
      }),

      new InterpolateHtmlPlugin({
        NODE_ENV: 'production',
        PUBLIC_URL: paths.servedPath.slice(0, -1),
        SITE_NAME: setting.siteName
      }),

      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),

      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css'
      }),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  });

  IsAnalyze &&
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 8888
      })
    );

  useDll &&
    config.plugins.push(
      ...Object.keys(library).map(name => {
        return new webpack.DllReferencePlugin({
          manifest: require(`${paths.appDllManifest}/${name}.manifest.json`)
        });
      }),
      new AddAssetHtmlPlugin(
        Object.keys(library).map(name => {
          return {
            filepath: require.resolve(
              path.resolve(`${paths.appBuildDll}/${name}.${lib_version}.dll.js`)
            ),
            outputPath: 'dll',
            publicPath: './dll'
          };
        })
      )
    );

  return config;
};
