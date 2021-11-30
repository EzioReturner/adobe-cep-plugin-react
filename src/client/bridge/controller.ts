import { materialStore } from '@/store/materialStore';
import events from './events';

class Controller {
  constructor() {
    this.init();
  }

  scriptLoader: any = null;

  /**
   * init - session
   *
   */
  async init() {
    console.log('client controller is initing...');

    if (process.env.NODE_ENV !== 'development' && process.env.MODE !== 'watch') return;

    await this.loadScriptLoader();

    console.log('client controller has inited');

    events.init();

    this.loadJsxFiles();

    this.getDocuments();

    this.getActiveDocument();
  }

  async loadScriptLoader() {
    console.log('loading scriptLoader...');

    let scriptLoader = await import('./scriptsLoader');

    console.log('loading scriptLoader done');

    this.scriptLoader = scriptLoader.default;
  }

  loadJsxFiles() {
    this.scriptLoader?.loadJSX('tools.jsx');
    this.scriptLoader?.loadJSX('JSON.jsx');
  }

  invokePlugin(functionName: string, params?: string) {
    return this.scriptLoader?.invokeScript(functionName, params);
  }

  /**
   * @NAME 获取文档列表
   */
  async getDocuments() {
    const list = await this.invokePlugin('getDocuments');

    materialStore.setDocuments(list?.split(',') || []);
  }

  /**
   * @NAME 获取激活文档
   */
  async getActiveDocument() {
    const active = await this.invokePlugin('getActiveDocument');

    materialStore.setActiveDocument(active);
  }

  /**
   * @NAME 切换激活文档
   */
  async setActiveDocument(name: string) {
    await this.invokePlugin('setActiveDocument', name);
  }
}

let controller = new Controller();

export default controller;
