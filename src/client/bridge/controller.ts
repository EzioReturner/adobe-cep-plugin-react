import { materialStore } from '@/store/materialStore';
import { CREATE_CODE, SELECT_CODE } from './constants';

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

    this.addListener();

    this.registerHostEvent();

    this.getDocuments();

    this.getActiveDocument();
  }

  async loadScriptLoader() {
    console.log('loading scriptLoader...');

    let scriptLoader = await import('./scriptsLoader');

    console.log('loading scriptLoader done');

    this.scriptLoader = scriptLoader.default;
  }

  addListener() {
    this.listenDocumentActive();
    this.listenLog();
    this.listenHostEvent();
  }

  registerHostEvent() {
    process.env.NODE_ENV === 'production' && this.scriptLoader?.registerPersistent();

    this.scriptLoader?.registerHostEvent(`${CREATE_CODE}, ${SELECT_CODE}`);
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
   * @NAME 获取文档下图层
   */
  // async getLayers(name: string) {
  //   const layers = await this.invokePlugin('getLayers', name);
  // }

  /**
   * @NAME 切换激活文档
   */
  async setActiveDocument(name: string) {
    await this.invokePlugin('setActiveDocument', name);
  }

  /**
   * @NAME 监听document切换激活
   */
  listenDocumentActive() {
    this.scriptLoader?.addEventListener('documentAfterActivate', (event: any) => {
      // console.log('documentAfterActivate', event);
    });
  }

  listenLog() {
    this.scriptLoader?.addEventListener('lucky_event_log', (event: any) => {
      console.log('lucky_event_log', event);
    });
  }

  /**
   * @NAME 监听注册的宿主事件
   */
  listenHostEvent() {
    this.scriptLoader?.addEventListener(
      'com.adobe.PhotoshopJSONCallback' + this.scriptLoader.extensionId,
      this.photoshopCallbackUnique
    );
  }

  /**
   * @NAME 处理注册事件回调
   */
  photoshopCallbackUnique = (csEvent: any) => {
    try {
      if (typeof csEvent.data === 'string') {
        var eventData = csEvent.data.replace('ver1,{', '{');
        var eventDataObject = JSON.parse(eventData);

        this.handleEventCallback(eventDataObject);
      } else {
        console.log('PhotoshopCallbackUnique expecting string for csEvent.data!');
      }
    } catch (e) {
      console.log('PhotoshopCallbackUnique catch: ' + e);
    }
  };

  /**
   * @NAME 根据事件码处理回调
   */
  handleEventCallback(eventDataObject: StoreKeyValue) {
    console.log('eventDataObject', eventDataObject);

    const { eventID, eventData } = eventDataObject;

    switch (eventID.toString()) {
      case CREATE_CODE:
        const { layerID, documentID } = eventData;

        if (documentID) {
          console.log('create document');
        } else if (layerID) {
          console.log('create layer');
        }
        break;

      case SELECT_CODE:
        console.log('select layer');
        break;
      default:
        break;
    }
  }
}

var controller = new Controller();

export default controller;
