import Axios from 'axios';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

interface IoOptions extends AxiosRequestConfig {
  returnConfig?: boolean; // 是否返回req配置项
  options?: AxiosRequestConfig;
}

class Request {
  instance: AxiosInstance;

  constructor() {
    const baseURL = ['localhost', '0.0.0.0', '10.130.94.195'].includes(window.location.hostname)
      ? `http://${window.location.hostname}:8081`
      : window.location.origin;
    this.instance = Axios.create({
      baseURL,
      timeout: 60000
    });
    this.initInterceptors();
  }

  // 初始化拦截器
  initInterceptors() {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (error: AxiosResponse) => {
        Promise.reject(error);
      }
    );
  }

  // 设置自定义头部
  setHeader = (key: string, val: string) => {
    this.instance.defaults.headers.common[key] = val;
  };

  // 错误notify
  notify(message: string | number) {}

  // 错误处理
  handleError = (error: any) => {
    const { errMsg, status, errCode } = error;
    if (errCode === '0990010600') {
      if (window.location.hostname === 'localhost') {
        console.log(`登录 token 失效，请重新获取 token`);
      } else {
        console.log(`登录状态失效，请重新登录`);
        window.location.href = '/logout';
      }
    }
    switch (status) {
      case 401:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        this.notify(errMsg || error);
        break;
    }
    return Promise.reject(error);
  };

  filterStatus(res: any, returnConfig: boolean) {
    const { data } = res;
    if (Array.isArray(data)) return data;
    if (data.success) {
      return returnConfig ? res : data;
    } else {
      return Promise.reject(data);
    }
  }

  sendRequest(method: Method, url: string, details: IoOptions) {
    const { params, returnConfig = false, data, options } = details;
    return this.instance
      .request({
        url,
        method,
        ...params,
        data,
        ...options
      })
      .then(res => (returnConfig ? res : res.data))
      .catch(this.handleError);
  }

  get(path: string, data: IoOptions = {}) {
    const { params } = data;
    let _path: string = path;
    if (params) {
      const keys = Object.keys(params);
      if (keys.length) {
        _path += `?${keys.map(key => `${key}=${params[key]}`).join('&')}`;
      }
    }
    return this.sendRequest('get', _path, data);
  }

  post(path: string, data: IoOptions) {
    const _path = path + '?_csrf=' + window.pageConfig._csrf;
    return this.sendRequest('post', _path, data);
  }

  put(path: string, data: IoOptions) {
    return this.sendRequest('put', path, data);
  }

  patch(path: string, data: IoOptions) {
    return this.sendRequest('patch', path, data);
  }

  delete(path: string, data: IoOptions) {
    return this.sendRequest('delete', path, data);
  }
}
const request = new Request();

export default request;
