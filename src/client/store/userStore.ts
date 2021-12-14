import { action, configure, observable, computed } from 'mobx';
import { layoutStore } from './layoutStore';
import intersection from 'lodash/intersection';
import io from '@api/io';

type IdentifyStatus = 'identifying' | 'identifyPass' | 'unauthorized';

configure({ enforceActions: 'observed' });
class UserStore {
  // 用户信息
  @observable userInfo: any = {};
  // 用户权限码
  @observable authority: string[] = [];
  // 当前的验证状态
  @observable identifyStatus: IdentifyStatus = 'identifying';

  @observable userToken: string | null = null;

  constructor() {
    this.initUserInfo();
  }

  @computed
  get authRedirect() {
    const [user] = layoutStore.routeConfig;
    const appRoutes = user.routes;
    if (appRoutes) {
      let redirectPath = '';
      for (let index = 0; index < appRoutes.length; index++) {
        const { redirect, authority: routeAuthority, path } = appRoutes[index];
        if (redirect || path === '/') continue;
        const allowed = !routeAuthority || intersection(userStore.authority, routeAuthority);
        if (allowed) {
          redirectPath = path;
          break;
        }
      }
      return redirectPath;
    }
    return '';
  }

  @action
  initUserInfo = () => {
    const cookie = window.localStorage.getItem('lk-authority');

    if (cookie) {
      this.setUserToken(cookie);
    } else {
      this.identifyStatus = 'unauthorized';
    }
    // setTimeout(() => {
    //   this.setAuthority(['admin']);
    // }, 1000);
  };

  @action
  setUserToken = (token: string) => {
    this.userToken = token;
    this.identifyStatus = 'identifyPass';
    this.authority = ['admin'];
    window.localStorage.setItem('lk-authority', token);

    io.setHeader('SMARKET-AUTH-TOKEN', token);
  };

  @action
  clearUserToken = () => {
    this.userToken = null;
    this.identifyStatus = 'unauthorized';
    this.authority = [];
    window.localStorage.removeItem('lk-authority');
  };

  // 获取用户权限
  getAuthority = (str?: undefined | string): string[] => {
    const authorityString: string | null =
      typeof str === 'undefined' ? window.localStorage.getItem('RA-authority') : str;
    let authority: string[];
    authority = authorityString ? JSON.parse(authorityString) : [];
    return authority;
  };

  // 设置用户权限
  @action setAuthority = (authority: string | string[]): void => {
    const raAuthority: string[] = typeof authority === 'string' ? [authority] : authority;
    window.localStorage.setItem('RA-authority', JSON.stringify(raAuthority));
    this.authority = raAuthority;
    this.identifyStatus = 'identifyPass';
  };

  // 用户登录事件
  @action handleUserLogin(name: string, password: number) {
    this.identifyStatus = 'identifying';
  }

  // 设置用户信息
  @action setUserInfo(userInfo: object): void {
    this.userInfo = userInfo;
  }

  // 用户登出，重置信息
  @action userLogout(): void {
    window.location.href = '/logout';
  }
}
export const userStore = new UserStore();
export default UserStore;
