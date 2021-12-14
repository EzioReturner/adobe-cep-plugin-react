const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const streamToArray = require('stream-to-array');
const http = require('http');
const https = require('https');
const mime = require('mime-types');
const { formatPath } = require('./utils');

function upload(ctx) {
  const { query } = ctx;

  console.log('[server]: on uploading');

  let { path: _path, docName } = query;

  console.log('[server]: berfore format path', _path);

  _path = formatPath(ctx, _path);

  console.log('[server]: formated path', _path);

  const fileType = mime.lookup(_path);

  const fileStream = fs.createReadStream(_path);

  const fileLength = fileStream._readableState.length;

  const boundaryKey = Math.random().toString(16);

  const startData =
    '--' +
    `${boundaryKey}\r\n` +
    `Content-Type: ${fileType}\r\n` +
    `Content-Disposition: form-data; name="uploadFile"; filename="${docName}"\r\n` +
    'Content-Transfer-Encoding: binary\r\n\r\n';

  const endData = '\r\n--' + boundaryKey + '--';

  const options = {
    host: '',
    port: 80,
    method: 'POST',
    path: ``,
    headers: {
      'SMARKET-AUTH-TOKEN': 'pocketadmin987321',
      'Content-Type': 'multipart/form-data; boundary=' + boundaryKey + '',
      'Content-Length': Buffer.byteLength(startData) + Buffer.byteLength(endData) + fileLength,
      'Transfer-Encoding': 'chunked'
    }
  };

  console.log('[server]: options', options);

  return new Promise((resolve, reject) => {
    const _http = options.port === 443 ? https : http;
    const req = _http.request(options, function (res) {
      const list = [];
      res.on('data', function (data) {
        // console.log('upload_file', `data=${data}`);
        console.log('[server]: res on data');
        list.push(data);
      });
      res.on('end', async function () {
        const body = Buffer.concat(list).toString('utf8');
        sendToWormhole(fileStream);

        console.log('[server]: res end data');
        // console.log('upload_file', `end=${body + ''}`);
        // console.log('fileupload status code=', res.statusCode, 'result=', body + '');
        resolve ? resolve(body + '') : '';
      });
    });
    // console.log('upload_file', 'start');
    req.write(startData);

    console.log('[server]: request already send');

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
      console.log('upload error', e);
      reject ? reject(e) : '';
    });
  });
}

module.exports = upload;
