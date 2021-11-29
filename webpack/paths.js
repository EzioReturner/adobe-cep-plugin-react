'use strict';

const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const pluginConfig = require('../pluginrc.js');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

const buildPath = process.env.BUILD_PATH || 'build';

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const getServedPath = () => {
  switch (process.env.NODE_LUCKY_ENV) {
    default:
      return 'client-dist/';
  }
};

const DIST_FOLDER_PATH = path.join(pluginConfig.destinationFolder, pluginConfig.extensionBundleId);

// config after eject: we're in ./config/
module.exports = {
  distFolder: DIST_FOLDER_PATH,
  distClientFolder: path.resolve(DIST_FOLDER_PATH, 'client-dist'),
  appBuildDist: resolveApp('dist/'),
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(buildPath),
  appBuildDll: resolveApp('webpack/dll'),
  appDllManifest: resolveApp('webpack/dllManifest'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/client/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  publicUrlOrPath,
  servedPath: getServedPath()
};

module.exports.moduleFileExtensions = moduleFileExtensions;
