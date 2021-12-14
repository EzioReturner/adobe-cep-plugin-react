'use strict';
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
const fs = require('fs');
const ora = require('ora');
const rm = require('rimraf');
const webpack = require('webpack');
const prodConfigFactory = require('../webpack/webpack.prod');
const dllConfig = require('../webpack/dll.config');
const paths = require('../webpack/paths');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const { library, libVersion } = require('../package.json');
const {
  log_progress,
  copyHostFiles,
  copyPublicFileToFolder,
  generateManifest,
  checkRunError,
  generateDebugFile
} = require('./utils.js');
const lib_version = libVersion ? libVersion.replace(/\./g, '_') : null;

const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = FileSizeReporter;

const { original } = JSON.parse(process.env.npm_config_argv);
const useDll = original.includes('--dll');

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const DIST_CLIENT_FOLDER = paths.distClientFolder;

const APP_BUILD_DIST = paths.appBuildDist;

// build app
rm(APP_BUILD_DIST, async function (err) {
  if (err) throw err;
  measureFileSizesBeforeBuild(DIST_CLIENT_FOLDER).then(async previousFileSizes => {
    buildDll()
      .then(async res => {
        await buildClient(previousFileSizes);

        copyPublicFileToFolder();

        copyHostFiles();

        generateManifest();

        generateDebugFile();

        log_progress('[info]: all building process done\n', 'blue');
      })
      .catch(err => {
        if (err) throw err;
      });
  });
});

function runWebpack(config) {
  return new Promise((resolve, reject) => {
    return webpack(config).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        checkRunError(stats);
        resolve(stats);
      }
    });
  }).catch(err => {
    checkRunError(err, true);
    throw err;
  });
}

async function buildClient(previousFileSizes) {
  const spinner = ora({ color: 'green', text: 'building for client...' });

  log_progress('\n[info]: start to build client...\n', 'yellow');
  spinner.start();

  const config = prodConfigFactory();
  const result = await runWebpack(config);
  spinner.stop();

  printFileSizesAfterBuild(
    result,
    previousFileSizes,
    paths.distClientFolder,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE
  );

  log_progress('\n[info]: client build complete.\n', 'yellow');
}

function buildDll() {
  return new Promise((resolve, reject) => {
    const existDll = useDll ? checkDllFiles() : false;
    useDll && log_progress('[info]: checking dll-lib files...\n');
    if (!useDll || existDll) {
      existDll && log_progress('[result]: exist dll-lib files.\n');
      resolve();
    } else {
      log_progress('[info]: dll-lib not found, start to build dll-lib...\n');
      const _spinner = ora({ color: 'green', text: 'building dll-lib...' });

      _spinner.start();
      const dllCompiler = webpack(dllConfig);

      dllCompiler.run((err, stats) => {
        err && reject(err);
        checkRunError(stats);
        _spinner.stop();
        log_progress('[result]: dll-lib build finished. \n');
        resolve();
      });
    }
  });
}

// check dll.js exists
function checkDllFiles() {
  const dllPath = paths.appBuildDll;
  const dllDirectory = fs.existsSync(dllPath);
  if (!dllDirectory) {
    return false;
  } else {
    const files = fs.readdirSync(dllPath);
    return Object.keys(library).every(name => {
      return files.includes(`${name}.${lib_version}.dll.js`);
    });
  }
}
