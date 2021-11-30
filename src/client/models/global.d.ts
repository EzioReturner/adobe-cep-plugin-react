declare interface StoreKeyValue {
  [name: string]: StoreValue;
}

declare type StoreValue = any;

declare const NODE_RA_ENV: string = 'development' | 'production';

declare const REQUEST_SUCCESS: number = 0;

declare interface CSInterfaceInstance {
  getExtensionID(): string;
  setPanelFlyoutMenu(xml: string): void;
  addEventListener(name: string, callback: (event: any) => void): void;
  dispatchEvent(event: CSEventInstance): void;
  evalScript(name: string, callback?: (event: any) => void): void;
  getSystemPath(path: string): string;
}

declare interface CSEventInstance {
  type?: string;
  scope?: string;
  extensionId?: string;
  data?: string;
}

declare interface Window {
  less: any;
  logProxy: (data: any) => void;
  pageConfig: {
    serverTime: string;
    _csrf: string;
    staticPath: string;
  };
  renderEnvironment?: string;
  __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  WEEKMAP: string[];
  bridge: StoreKeyValue;
  CSInterface: {
    new (): CSInterfaceInstance;
  };
  CSEvent: {
    new (type?: string, scope?: string): CSEventInstance;
  };
  SystemPath: any;
}

// declare interface CSInterfaceInstance {
//   getExtensionID: () => string;
// }

declare interface Breadcrumb {
  name: string;
  path: string;
  display: boolean;
}

/**
 * @hideBreadcrumb 隐藏面包屑
 * @withoutHeaderBody 只需要面包屑
 * @title 标题
 * @subTitle 副标题
 * @content 内容
 * @extraContent 右侧额外内容
 * @logo logo
 */
declare interface PageHeaderProps {
  hideBreadcrumb?: boolean;
  withoutHeaderBody?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
  logo?: React.ReactNode;
}

declare interface PageWrapperProps extends PageHeaderProps {
  hideHeader?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * @name 组件名称
 * @icon 菜单对应的图标
 * @path 路由对应路径
 * @authority 路由对应权限
 * @component [组件路径， 组件加载动画名]
 * @routes 子路由
 * @hideMenu 是否显示菜单
 * @exact 精确匹配
 * @redirect 重定向路由
 * @meta 元信息
 * @loading 异步加载时间过长开启loading
 * @search react-router search字段
 */
declare interface RouteChild {
  name?: string;
  icon?: React.ReactNode | string;
  path: string;
  authority?: string[] | string;
  // component?: [string | React.ReactNode, string] | [string | React.ReactNode];
  component?: React.ReactNode;
  routes?: RouteChild[];
  hideMenu?: boolean;
  exact?: boolean;
  redirect?: string;
  meta?: any;
  loading?: boolean;
  search?: string;
  extraInfo?: any;
}

declare interface RouteRoot {
  name?: string;
  icon?: React.ReactNode | string;
  path: string;
  authority?: string[] | string;
  component?: React.ReactNode;
  routes?: RouteChild[];
  redirect?: string;
  exact?: boolean;
  strict?: boolean;
  key?: string | number;
  extraInfo?: any;
}
