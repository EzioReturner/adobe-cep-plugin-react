const path = require('path');

function formatPath(ctx, _path) {
  const { header } = ctx;

  const agent = header['user-agent'];

  const isMac = agent.indexOf('Mac OS X') > -1;

  if (isMac) {
    const prefix = `${path.resolve(__dirname).split('/').slice(0, 3).join('/')}`;

    _path = _path.replace('~', prefix);
  } else {
    _path = path.normalize(_path);
  }

  return _path;
}

module.exports = {
  formatPath
};
