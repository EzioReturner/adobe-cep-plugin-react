import { materialStore } from '@/store/materialStore';
import events from './events';
import { ScriptLoader } from './scriptsLoader';
import { userStore } from '@store/userStore';
class Controller {
  constructor() {
    this.init();
  }

  scriptLoader: ScriptLoader | null = null;

  /**
   * init - session
   *
   */
  async init() {
    console.log('client controller is initing...');

    await this.loadScriptLoader();

    console.log('client controller has inited');

    events.init();

    this.loadJsxFiles();

    this.getDocuments();

    this.getActiveDocument();

    this.startServer();
  }

  startServer() {
    if (this.scriptLoader?.extensionDirectory && userStore.userToken) {
      console.log('server starting...');

      let localServer = window.cep_node.require(
        this.scriptLoader.extensionDirectory + '/server/main.js'
      );

      var r = localServer();
      console.log(r);
    }
  }

  async loadScriptLoader() {
    console.log('loading scriptLoader...');

    let scriptLoader = await import('./scriptsLoader');

    console.log('loading scriptLoader done');

    this.scriptLoader = scriptLoader.default;
  }

  loadJsxFiles() {
    this.scriptLoader?.loadJSX('JSON.jsx');
    this.scriptLoader?.loadJSX('get.jsx');
    this.scriptLoader?.loadJSX('tools.jsx');
    this.scriptLoader?.loadJSX('actions.jsx');
  }

  invokePlugin(functionName: string, params?: string) {
    return this.scriptLoader?.invokeScript(functionName, params);
  }

  /**
   * @NAME 获取文档列表
   */
  async getDocuments() {
    const list = await this.invokePlugin('getDocuments');

    list && materialStore.setDocuments(list?.split(','));
  }

  /**
   * @NAME 获取激活文档
   */
  async getActiveDocument() {
    const active = await this.invokePlugin('getActiveDocument');

    active && materialStore.dispatchSetActiveDocument(active);
  }

  /**
   * @NAME 切换激活文档
   */
  async dispatchSetActiveDocument(name: string) {
    await this.invokePlugin('dispatchSetActiveDocument', name);
  }
}

let controller = new Controller();

export default controller;
