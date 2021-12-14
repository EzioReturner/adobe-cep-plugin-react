const Koa = require('koa');
const app = new Koa();
const router = require('@koa/router')();
const streamUpload = require('./upload.js');
const { formatPath } = require('./utils');
const rm = require('rimraf');
const https = require('https');
const http = require('http');
const bodyParser = require('koa-bodyparser');
const querystring = require('querystring');

function upload(ctx) {
  return streamUpload(ctx)
    .then(res => {
      ctx.response.status = 200;

      ctx.response.body = res;
    })
    .catch(err => {
      ctx.response.status = 500;

      ctx.response.body = err;
    });
}

function removeFile(ctx) {
  const { query } = ctx;

  let { path: _path } = query;

  _path = formatPath(ctx, _path);

  console.log('[server]: _path ', _path);

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

function proxyRequest(ctx) {
  const { url, host, params, headers, method, protocol } = ctx.request.body;

  const options = {
    host: host,
    port: protocol === 'http' ? 80 : 443,
    method: method.toUpperCase(),
    path: url
  };

  if (headers) {
    options.headers = JSON.parse(headers);
  }

  if (method === 'get' && params) {
    options.path = `${url}?${querystring.stringify(JSON.parse(params))}`;
  }

  return new Promise((resolve, reject) => {
    var _http = protocol === 'http' ? http : https;

    var req = _http
      .request(options, function (res) {
        res.on('data', function (data) {
          ctx.response.status = 200;
          ctx.response.body = data;
          resolve(data);
        });
      })
      .on('error', function (e) {
        ctx.response.status = 500;
        ctx.response.body = e;
        reject(e);
      });

    if (method === 'post' && params) {
      req.write(params);
    }

    req.end();
  });
}

function weather(ctx) {
  return new Promise((resolve, reject) => {
    https
      .get(
        'https://restapi.amap.com/v3/weather/weatherInfo?key=cc24ccab0a88c3ee17eb8dee0e07ba61&city=350200&extensions=all',
        function (res) {
          res.on('data', function (data) {
            ctx.response.status = 200;
            ctx.response.body = data;
            resolve(data);
          });
        }
      )
      .on('error', function (e) {
        ctx.response.status = 500;
        ctx.response.body = e;
        reject(e);
      });
  });
}

function run() {
  const port = 7701;

  app.use(bodyParser());

  router.get('/upload', upload).get('/removeFile', removeFile).post('/proxyRequest', proxyRequest);

  app.use(router.routes());

  var server = app.listen(port);

  server.timeout = 15 * 1000;

  return 'server online';
}

module.exports = run;
