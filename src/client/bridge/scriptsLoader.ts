import { message } from 'antd';

/**
 * load jsx scripts dynamically
 */
class ScriptLoader {
  EvalScript_ErrMessage = 'EvalScript error.';

  cs: CSInterfaceInstance = {} as CSInterfaceInstance;

  extensionId: string = '';

  extensionDirectory: string = '';

  constructor() {
    this.init();
  }

  init() {
    this.cs = new window.CSInterface();

    this.extensionId = this.cs.getExtensionID();

    this.extensionDirectory = this.cs.getSystemPath(window.SystemPath.EXTENSION);

    this.initFlyoutMenu();
  }

  /**
   * @NAME 注册宿主菜单
   */
  initFlyoutMenu() {
    var flyoutXML =
      '<Menu> \
    <MenuItem Id="refreshView" Label="refresh view"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Label="Parent Menu (wont work on PS CC 2014.2.0)"> \
      <MenuItem Label="Child Menu 1"/> \
      <MenuItem Label="Child Menu 2"/> \
    </MenuItem> \
  </Menu>';

    // Uses the XML string to build the menu
    this.cs.setPanelFlyoutMenu(flyoutXML);

    // Listen for the Flyout menu clicks
    this.cs.addEventListener(
      'com.adobe.csxs.events.flyoutMenuClicked',
      this.flyoutMenuClickedHandler
    );
  }

  flyoutMenuClickedHandler = (event: any) => {
    switch (event.data.menuId) {
      case 'refreshView':
        window.location.reload();
        break;

      default:
        console.log(event.data.menuName + ' clicked!');
    }
  };

  /**
   * @NAME 注册持久化运行事件
   */
  registerPersistent() {
    let event = new window.CSEvent();

    event.type = 'com.adobe.PhotoshopPersistent';
    event.scope = 'APPLICATION';
    event.extensionId = this.extensionId;

    this.cs.dispatchEvent(event);
    this.log(`register <com.adobe.PhotoshopPersistent> event done`);
  }

  /**
   * @NAME 注册宿主事件
   */
  registerHostEvent(eventId: string) {
    let event = new window.CSEvent('com.adobe.PhotoshopRegisterEvent', 'APPLICATION');

    event.extensionId = this.extensionId;
    event.data = eventId;

    this.cs.dispatchEvent(event);

    this.log(`register <${eventId}> event done`);
  }

  // toggleEventRegistering(eventStringID, isOn) {
  //   var event;
  //   if (isOn) {
  //     event = new CSEvent('com.adobe.PhotoshopRegisterEvent', 'APPLICATION');
  //   } else {
  //     event = new CSEvent('com.adobe.PhotoshopUnRegisterEvent', 'APPLICATION');
  //   }
  //   event.extensionId = this.extensionId;

  //   this.cs.evalScript("app.stringIDToTypeID('" + eventStringID + "')", typeID => {
  //     console.log('typeID', typeID);
  //     event.data = typeID;
  //     this.cs.dispatchEvent(event);
  //     console.log('Dispatched Event ' + eventStringID, event);
  //   });
  // }

  /**
   * @NAME 添加监听事件
   */
  addEventListener(key: string, callback: (event: any) => void) {
    this.cs.addEventListener(key, callback);
  }

  loadJSX(fileName: string) {
    var extensionRoot = this.extensionDirectory + '/host/';

    this.cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  }

  invokeScript(functionName: string, params?: string): Promise<string> {
    var params_string = params ? JSON.stringify(params) : '';

    var eval_string = `${functionName}(${params_string})`;

    var that = this;

    that.log(`eval string: ${eval_string}`);

    return new Promise((resolve, reject) => {
      var callback = function (eval_res: string) {
        if (typeof eval_res === 'string') {
          if (eval_res.toLowerCase().indexOf('error') != -1) {
            that.log(`err eval: ${functionName}`);

            // message.error(`err eval: ${functionName}`);

            reject(eval_res);

            return eval_res;
          }
        }

        // message.success(`success eval: ${functionName}`);

        that.log(`success eval: ${functionName}`);
        resolve(eval_res);
        return eval_res;
      };

      that.cs.evalScript(eval_string, callback);
    });
  }

  log(val: string | number) {
    console.log(`${this.name} ${val}`);
  }

  get name() {
    return 'ScriptLoader:: ';
  }
}

var scriptLoader = new ScriptLoader();

window.bridge = scriptLoader;

export { ScriptLoader };

export default scriptLoader;
