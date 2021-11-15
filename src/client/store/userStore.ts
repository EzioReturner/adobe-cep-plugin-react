import { action, configure, observable, computed } from 'mobx';
import { layoutStore } from './layoutStore';
import intersection from 'lodash/intersection';

type IdentifyStatus = 'identifying' | 'identifyPass' | 'unauthorized';

configure({ enforceActions: 'observed' });
class UserStore {
  // 用户信息
  @observable userInfo: any = {};
  // 用户权限码
  @observable authority: string[] = ['admin'];
  // 当前的验证状态
  @observable identifyStatus: IdentifyStatus = 'identifying';

  constructor() {
    this.initUserInfo();
  }

  @computed
  get authRedirect() {
    const [, app] = layoutStore.routeConfig;
    const appRoutes = app.routes;
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

  initUserInfo = () => {
    // setTimeout(() => {
    //   this.setAuthority(['admin']);
    // }, 1000);
  };

  // 设置用户权限
  @action setAuthority = (authority: string[]): void => {
    this.authority = authority;
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
