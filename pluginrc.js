const path = require('path');
const root = __dirname;
const srcFolder = path.join(root, 'src');
const destFolder = path.join(root, 'dist');
const certPath = path.join(destFolder, 'cert.p12');
module.exports = {
  extensionBundleId: 'com.react.adobe.plugin',
  extensionBundleName: 'react.adobe.plugin',
  extensionBundleVersion: '1.1.1',
  cepVersion: '8.0',
  panelName: 'react-adobe-plugin',
  width: '450',
  height: '650',
  root: root,
  sourceFolder: srcFolder,
  destinationFolder: destFolder,
  certificate: {
    customCert: {
      path: '',
      password: 'password'
    },
    selfSign: {
      country: 'US',
      province: 'CA',
      org: 'org',
      name: '',
      password: 'password',
      locality: 'locality',
      orgUnit: 'orgUnit',
      email: '',
      output: certPath
    }
  }
};
