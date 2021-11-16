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

    process.env.NODE_ENV !== 'development' && (await this.loadScriptLoader());

    console.log('client controller has inited');
  }

  invokePlugin(functionName: string, options: StoreKeyValue) {
    console.log('invokePlugin:', functionName, options);
    this.scriptLoader?.evalScript(functionName, options);
  }

  async loadScriptLoader() {
    console.log('loading scriptLoader...');

    let scriptLoader = await import('./scriptsLoader');

    console.log('loading scriptLoader done');

    this.scriptLoader = scriptLoader.default;

    // this.scriptLoader.loadJSX('main.jsx');
  }
}

var controller = new Controller();

export default controller;
