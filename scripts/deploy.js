/**
 * deploy in dev mode or production
 */
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const utils = require('./utils.js');
const pluginConfig = require('../pluginrc.js');
const paths = require('../webpack/paths');

const DIST_FOLDER = paths.distFolder;
const env = utils.resolveEnv();
const isDev = env === 'development';
const isWindows = utils.resolveWindows();
const extensionBundleId = pluginConfig.extensionBundleId;
const resolvedTargetFolder = resolveDeploymentFolder();

deploy();

/**
 * deploy
 *
 */
function deploy() {
  utils.log_progress(`[info]: DEPLOY for ${env}\n`, 'blue');

  cleanTarget(resolvedTargetFolder);

  if (isDev) deployDevMode();
  else deployProdMode();

  printDeploymentFolder();

  utils.log_progress('DONE\n', 'blue');
}

function printDeploymentFolder() {
  utils.log_progress(`[info]: deployed to folder ${resolvedTargetFolder}\n`, 'green');
}

/**
 *  resolve the final deployment folder
 *
 */
function resolveDeploymentFolder() {
  return path.join(resolveExtensionFolder(), extensionBundleId);
}

/**
 *  per os Adobe extension folder
 *
 */
function resolveExtensionFolder() {
  if (isWindows) {
    const extensionsPath = os.userInfo().homedir + '\\AppData\\Roaming\\Adobe\\CEP\\extensions';
    if (!fs.existsSync(extensionsPath)) fs.mkdirSync(extensionsPath, { recursive: true });

    return extensionsPath;
  } else {
    return path.join(os.homedir(), 'Library/Application Support/Adobe/CEP/extensions');
  }
}

/**
 * cleanTarget - clean the target folder. if it is a
 * symlink then unlink, and if it is a folder then delete.
 *
 */
function cleanTarget(target) {
  utils.log_progress('[info]: cleaning target\n');

  try {
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) fs.unlinkSync(target);
    utils.deleteFolderRecursive(target);
  } catch (err) {
    utils.log_error(err);
  }
}

/**
 * deployDevMode - just create a symlink
 *
 */
function deployDevMode() {
  try {
    utils.log_progress('[info]: patching\n');
    if (isWindows) {
      execSync(
        'REG ADD HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.8 /v PlayerDebugMode /t REG_SZ /d 1 /f'
      ); // CC 2018
      execSync(
        'REG ADD HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.9 /v PlayerDebugMode /t REG_SZ /d 1 /f'
      ); // CC 2019 & 2020
    } else {
      execSync('defaults write com.adobe.CSXS.8 PlayerDebugMode 1', { stdio: [0, 1, 2] }); // CC 2018
      execSync('defaults write com.adobe.CSXS.9 PlayerDebugMode 1', { stdio: [0, 1, 2] }); // CC 2019 & 2020
    }
  } catch (err) {
    utils.log_error(err);
  }

  utils.log_progress('[info]: creating symlink into extensions folder\n');
  try {
    var type = isWindows ? 'junction' : 'dir';

    fs.symlinkSync(DIST_FOLDER, resolvedTargetFolder, type);
  } catch (err) {
    utils.log_error(err);
  }
}

/**
 * deployProdMode - copy the whole dist folder
 *
 */
function deployProdMode() {
  utils.log_progress('[info]: copying into extensions folder\n');
  try {
    utils.copyRecursiveSync(DIST_FOLDER, resolvedTargetFolder);
  } catch (err) {
    utils.log_error(err);
  }
}

module.exports = {
  deploy
};
