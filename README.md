<h1 align="center">adobe-cep-plugin-react</h1>

<div align="center">
  adobe cep plugin by react & typescript
</div>

<div align="center">
  photoshop cep 插件，集成 react & typescript
</div>

<div align="center">
  reference to 
  <a href="https://github.com/HendrixString/adobe-cep-react-create">
    adobe-cep-react-create
  </a>
</div>

this Adobe-CEP extension creator bootstraps for creating Adobe CC extensions easily with
modern web technologies and with native node.js modules for session logic
and with support for extendscript (host app). It is built in a semi opinionated
way so you can focus on writing your great extensions.


### what changes? / 有哪些改动？
- 移除原项目中的 `session` 文件夹，通过 `client/bridge` 作为 ps 通信桥梁。

- 使用 `typescript` 增强代码鲁棒性。

- 调整原项目的本地编译与打包代码，增加 `watch` 指令，方便与ps调试。

### 本地开发
- `yarn watch` 将自动打包并生成link文件至 `cep/extensions/` 路径下，同时 watch 项目文件变化，对于非 client 文件夹下的新建删除文件操作，需重新执行 watch。
- 在 `.debug.template.js` 中调整浏览器端口，默认为 7001，在应用程序中加载插件之后，通过浏览器访问对应端口即可调试，如：http://localhost:`PORT`。


### 如何打包
- `yarn release:prod` 将重新构建打包项目，并读取 `./pluginrc.js` 文件配置对插件进行签名，最终输出对应的 .zxp 文件。

#### how to customize
start with `./pluginrc.js`, this is the plugin config I created, here is an example
```javascript
module.exports = {
  extensionBundleId: 'com.react.ps.plugin',
  extensionBundleName: 'react.ps.plugin',
  extensionBundleVersion: '1.0.1',
  cepVersion: '7.0',
  panelName: 'react-ps-plugin',
  width: '1000',
  height: '800',
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
      password: '',
      locality: 'locality',
      orgUnit: 'orgUnit',
      email: '',
      output: certPath
    }
  }
};
```


### 更多信息，请参考
https://github.com/HendrixString/adobe-cep-react-create