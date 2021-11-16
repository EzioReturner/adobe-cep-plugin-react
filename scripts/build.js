'use strict';
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const rm = require('rimraf');
const fsExtra = require('fs-extra');
const webpack = require('webpack');
const prodConfigFactory = require('../webpack/webpack.prod');
const dllConfig = require('../webpack/dll.config');
const paths = require('../webpack/paths');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const { library, libVersion } = require('../package.json');
const pluginConfig = require('../pluginrc');
const { copyRecursiveSync, log_progress, resolveEnv } = require('./utils.js');
const lib_version = libVersion ? libVersion.replace(/\./g, '_') : null;

const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = FileSizeReporter;

const { original } = JSON.parse(process.env.npm_config_argv);
const useDll = original.includes('--dll');

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const ADOBE_ASSETS_PATH = path.join(paths.appPath, 'assets');

const ADOBE_HOST_PATH = path.join(paths.appSrc, 'host');

const ADOBE_LIBS_PATH = path.join(paths.appSrc, 'libs');

const DIST_FOLDER = paths.distFolder;

const DIST_CLIENT_FOLDER = paths.distClientFolder;

const ADOBE_TEMPLATES_PATH = path.join(ADOBE_ASSETS_PATH, 'templates');

const env = resolveEnv();

const isDev = env === 'development';

// build app
rm(DIST_FOLDER, async function (err) {
  if (err) throw err;
  measureFileSizesBeforeBuild(DIST_CLIENT_FOLDER).then(async previousFileSizes => {
    buildDll()
      .then(async res => {
        await buildClient(previousFileSizes);

        copyAdobeFiles();

        generateManifest();

        devProcess();

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

function devProcess() {
  if (isDev) {
    log_progress('[info]: generating .debug file...\n');
    var debug_template = require(path.join(ADOBE_TEMPLATES_PATH, '.debug.template.js'));
    var rendered_debug = debug_template(pluginConfig);
    var debug_out_file = path.join(DIST_FOLDER, '.debug');
    fs.writeFileSync(debug_out_file, rendered_debug, 'utf-8');
  }
}

function copyAdobeFiles() {
  log_progress('[info]: copying host files...\n');
  copyRecursiveSync(ADOBE_HOST_PATH, path.join(DIST_FOLDER, 'host'));

  log_progress('[info]: copying libs files...\n');
  copyRecursiveSync(ADOBE_LIBS_PATH, path.join(DIST_FOLDER, 'libs'));

  log_progress('[info]: copying Adobe assets...\n');
  copyRecursiveSync(ADOBE_ASSETS_PATH, DIST_FOLDER, ['templates']);
}

function generateManifest() {
  log_progress('[info]: generating manifest...\n');

  var manifest_template = require(path.join(ADOBE_TEMPLATES_PATH, 'manifest.template.xml.js'));
  var rendered_xml = manifest_template(pluginConfig);

  var xml_out_dir = path.join(DIST_FOLDER, 'CSXS');
  fs.mkdir(xml_out_dir, { recursive: true }, err => {
    if (err) throw err;
  });

  var xml_out_file = path.join(DIST_FOLDER, 'CSXS', 'manifest.xml');
  fs.writeFileSync(xml_out_file, rendered_xml, 'utf-8');
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

function checkRunError(stats, force) {
  if (stats.hasErrors?.() || force) {
    process.stdout.write(stats.toString() + '\n');
    log_progress('[result]: build failed with errors.\n');
    process.exit(1);
  }
}
