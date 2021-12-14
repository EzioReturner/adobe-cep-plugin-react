const path = require('path');
const homeDir = require('os').homedir();

function formatPath(ctx, _path) {
  const { header } = ctx;

  const agent = header['user-agent'];

  const isMac = agent.indexOf('Mac OS X') > -1;

  _path = _path.replace('~', homeDir);

  if (!isMac) {
    _path = path.normalize(_path);
  }

  return _path;
}

module.exports = {
  formatPath
};
