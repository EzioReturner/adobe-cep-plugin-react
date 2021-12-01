const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const streamToArray = require('stream-to-array');
const http = require('http');
const https = require('https');
const mime = require('mime-types');
const { formatPath } = require('./utils');

function upload(ctx) {
  const { query } = ctx;

  let { path: _path, docName } = query;

  _path = formatPath(ctx, _path);

  const fileType = mime.lookup(_path);

  const fileStream = fs.createReadStream(_path);

  const fileLength = fileStream._readableState.length;

  const boundaryKey = Math.random().toString(16);

  const startData =
    '--' +
    `${boundaryKey}\r\n` +
    `Content-Type: ${fileType}\r\n` +
    `Content-Disposition: form-data; name="picture"; filename="${docName}"\r\n` +
    'Content-Transfer-Encoding: binary\r\n\r\n';

  const endData = '\r\n--' + boundaryKey + '--';

  const options = {
    host: '',
    port: 80,
    method: 'POST',
    path: '',
    headers: {
      'SMARKET-AUTH-TOKEN': 123456,
      'Content-Type': 'multipart/form-data; boundary=' + boundaryKey + '',
      'Content-Length': Buffer.byteLength(startData) + Buffer.byteLength(endData) + fileLength,
      'Transfer-Encoding': 'chunked'
    }
  };

  return new Promise((resolve, reject) => {
    const _http = options.port === 443 ? https : http;
    const req = _http.request(options, function (res) {
      const list = [];
      res.on('data', function (data) {
        // console.log('upload_file', `data=${data}`);
        list.push(data);
      });
      res.on('end', async function () {
        const body = Buffer.concat(list).toString('utf8');
        sendToWormhole(fileStream);
        // console.log('upload_file', `end=${body + ''}`);
        // console.log('fileupload status code=', res.statusCode, 'result=', body + '');
        resolve ? resolve(body + '') : '';
      });
    });
    // console.log('upload_file', 'start');
    req.write(startData);

    streamToArray(fileStream).then(function (parts) {
      let part = null;
      for (let i = 0, l = parts.length; i < l; ++i) {
        part = parts[i];
        req.write(part instanceof Buffer ? part : new Buffer(part));
        // console.log('upload_file', `write ${i}`);
      }
      req.end(endData);
      // console.log('upload_file', 'end');
    });

    req.on('error', function (e) {
      ctx.app.logger.info('upload_file', 'error');
      reject ? reject(e) : '';
    });
  });
}

module.exports = upload;
