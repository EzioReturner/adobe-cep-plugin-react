'use strict';
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';
process.env.MODE = 'watch';

const ora = require('ora');
const rm = require('rimraf');
const webpack = require('webpack');
const configFactory = require('../webpack/webpack.watch');
const paths = require('../webpack/paths');

const { deploy } = require('./deploy');

const {
  log_progress,
  copyHostFiles,
  copyPublicFileToFolder,
  generateManifest,
  checkRunError,
  generateDebugFile
} = require('./utils.js');

const DIST_FOLDER = paths.distFolder;

const spinner = ora({ color: 'green', text: 'building for client...' });

// build app
rm(DIST_FOLDER, async function (err) {
  if (err) throw err;

  await watchClient();

  copyPublicFileToFolder();

  copyHostFiles();

  generateManifest();

  generateDebugFile();

  log_progress('[info]: all building process done\n', 'blue');

  log_progress('[info]: start to deploy\n', 'yellow');

  deploy();
});

function runWatch(config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.hooks.watchRun.tap('WatchRun', comp => {
      spinner.start();
    });

    return compiler.watch(
      {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000
      },
      (err, stats) => {
        spinner.stop();

        const { startTime, endTime } = stats;

        log_progress(`[info]: build time ${(endTime - startTime) / 1000}s\n`, 'magenta');

        if (err) {
          reject(err);
        } else {
          process.stdout.write(stats.toString() + '\n');
          log_progress('[result]: build failed with errors.\n');
          // checkRunError(stats);
          resolve(stats);
        }
      }
    );
  }).catch(err => {
    checkRunError(err, true);
    throw err;
  });
}

async function watchClient() {
  log_progress('\n[info]: start to watch files...\n', 'yellow');

  const config = configFactory();
  await runWatch(config);

  log_progress('\n[info]: client build completed.\n', 'yellow');
}
