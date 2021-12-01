/**
 *
 * the build script for the whole thing
 */

var fs = require('fs');
var path = require('path');
const chalk = require('chalk');
const pluginConfig = require('../pluginrc');
const fsExtra = require('fs-extra');
const paths = require('../webpack/paths');

const ADOBE_ASSETS_PATH = path.join(paths.appPath, 'assets');

const ADOBE_HOST_PATH = path.join(paths.appSrc, 'host');

const ADOBE_SERVER_PATH = path.join(paths.appSrc, 'server');

const ADOBE_LIBS_PATH = path.join(paths.appSrc, 'libs');

const DIST_FOLDER = paths.distFolder;

const ADOBE_TEMPLATES_PATH = path.join(ADOBE_ASSETS_PATH, 'templates');

const env = resolveEnv();

const isDev = env === 'development';

function generateDebugFile() {
  if (isDev) {
    log_progress('[info]: generating .debug file...\n');
    var debug_template = require(path.join(ADOBE_TEMPLATES_PATH, '.debug.template.js'));
    var rendered_debug = debug_template(pluginConfig);
    var debug_out_file = path.join(DIST_FOLDER, '.debug');
    fs.writeFileSync(debug_out_file, rendered_debug, 'utf-8');
  }
}

function copyHostFiles() {
  log_progress('[info]: copying host files...\n');
  copyRecursiveSync(ADOBE_HOST_PATH, path.join(DIST_FOLDER, 'host'), [
    'package.json',
    'yarn.lock',
    'package-lock.json',
    'node_modules'
  ]);

  log_progress('[info]: copying host node_modules...\n');
  copyRecursiveSync(
    path.join(ADOBE_HOST_PATH, 'node_modules'),
    path.join(DIST_FOLDER, 'node_modules')
  );

  log_progress('[info]: copying server files...\n');
  copyRecursiveSync(ADOBE_SERVER_PATH, path.join(DIST_FOLDER, 'server'));

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

function checkRunError(stats, force) {
  if (stats.hasErrors?.() || force) {
    process.stdout.write(stats.toString() + '\n');
    log_progress('[result]: build failed with errors.\n');
    process.exit(1);
  }
}

function copyPublicFileToFolder() {
  fsExtra.copySync(paths.appPublic, DIST_FOLDER, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
}

function deleteFolderRecursive(src) {
  if (fs.existsSync(src)) {
    fs.readdirSync(src).forEach(function (file, index) {
      var curPath = path.join(src, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(src);
  }
}

function hasInList(item, list) {
  var res = false;

  if (!list) return false;

  list.forEach(one => {
    if (one === item) {
      res = true;
      return;
    }
  });

  return res;
}

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 * @param {ignore_list} folders to ignore in the first level only
 */
function copyRecursiveSync(src, dest, ignore_list) {
  var exists = fs.existsSync(src);
  var exists_dest = fs.existsSync(dest);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    if (!exists_dest) fs.mkdirSync(dest);
    fs.readdirSync(src)
      .filter(item => !hasInList(item, ignore_list))
      .forEach(childItemName => {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
  } else {
    fs.linkSync(src, dest);
  }
}

function log(val) {
  console.log(val);
}

function log_error(val) {
  log_progress(val, 'red');
}

function log_progress(val, color) {
  var c = color ? color : 'cyan';

  console.log(chalk[c](val));
}

function resolveWindows() {
  return process.platform.startsWith('win');
}

/**
 * resolve env from process argumants
 *
 */
function resolveEnv() {
  var env = 'development';

  var args = process.argv;

  // we have an argument
  if (args.length >= 3) {
    env = args[2];
  }

  return env;
}

module.exports = {
  deleteFolderRecursive,
  copyRecursiveSync,
  log,
  log_error,
  log_progress,
  resolveWindows,
  resolveEnv,
  generateDebugFile,
  copyHostFiles,
  generateManifest,
  checkRunError,
  copyPublicFileToFolder
};
