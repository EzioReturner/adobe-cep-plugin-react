import { materialStore } from '@/store/materialStore';
import controller from './controller';
import { CREATE_CODE, SELECT_CODE } from './constants';

class Events {
  constructor() {}

  /**
   * init - session
   *
   */
  async init() {
    this.addListener();
    this.registerHostEvent();
  }

  addListener() {
    this.listenDocumentActive();
    this.listenLog();
    this.listenHostEvent();

    console.log('client events has inited');
  }

  registerHostEvent() {
    process.env.NODE_ENV === 'production' && controller.scriptLoader?.registerPersistent();

    controller.scriptLoader?.registerHostEvent(`${CREATE_CODE}, ${SELECT_CODE}`);
  }

  /**
   * @NAME 监听document切换激活
   */
  listenDocumentActive() {
    controller.scriptLoader?.addEventListener('documentAfterActivate', (event: any) => {
      // console.log('documentAfterActivate', event);
    });
  }

  listenLog() {
    controller.scriptLoader?.addEventListener('event_log', (event: any) => {
      console.log('event_log', event);
    });
  }

  /**
   * @NAME 监听注册的宿主事件
   */
  listenHostEvent() {
    controller.scriptLoader?.addEventListener(
      'com.adobe.PhotoshopJSONCallback' + controller.scriptLoader.extensionId,
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
        {
          const { layerID, documentID } = eventData;

          if (documentID) {
            console.log('create document');
          } else if (layerID) {
            console.log('create layer');
          }
        }
        break;

      case SELECT_CODE:
        {
          const { layerID } = eventData;

          if (layerID) {
            materialStore.updateSelectedLayer(layerID);
          }
          console.log('select layer');
        }
        break;
      default:
        break;
    }
  }
}

var events = new Events();

export default events;
