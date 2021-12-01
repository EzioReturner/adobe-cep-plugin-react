const Koa = require('koa');
const app = new Koa();
const router = require('@koa/router')();
const streamUpload = require('./upload.js');
const { formatPath } = require('./utils');
const rm = require('rimraf');

function upload(ctx) {
  return streamUpload(ctx).then(res => {
    ctx.response.status = 200;

    ctx.response.body = res;
  });
}

function removeFile(ctx) {
  const { query } = ctx;

  let { path: _path } = query;

  _path = formatPath(ctx, _path);

  return new Promise((resolve, reject) => {
    rm(_path, err => {
      if (err) reject(err);
      resolve();
    });
  })
    .then(res => {
      ctx.response.status = 200;

      ctx.response.body = 'rm done';
    })
    .catch(err => {
      ctx.response.status = 500;

      ctx.response.body = 'rm error';
    });
}

function run() {
  const port = 7701;

  router.get('/upload', upload).get('/removeFile', removeFile);

  app.use(router.routes());

  app.listen(port);

  return 'app running';
}

module.exports = run;
