export const constantRouteConfig: { app: RouteRoot; user: RouteRoot } = {
  app: {
    path: '/',
    component: '/skeleton/Main',
    authority: ['admin', 'guest'],
    routes: []
  },
  user: {
    path: '/user',
    component: '/skeleton/User',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: '/views/Login/UnionAuth'
      }
    ]
  }
};

export const asyncRouteConfig: RouteChild[] = [
  {
    path: '/',
    exact: true,
    redirect: '/material/upload',
    hideMenu: true
  },
  {
    name: 'material',
    path: '/material',
    routes: [
      {
        name: 'upload',
        path: '/material/upload',
        component: '/views/Materials/Upload'
      }
    ]
  },
  {
    name: 'exception',
    path: '/exception',
    routes: [
      {
        name: '403',
        path: '/exception/403',
        component: '/views/Exception/403'
      },
      {
        name: '404',
        path: '/exception/404',
        component: '/views/Exception/404'
      },
      {
        name: '500',
        path: '/exception/500',
        component: '/views/Exception/500'
      },
      {
        name: 'index',
        path: '/exception/home',
        component: '/views/Exception',
        hideMenu: true
      }
    ]
  }

  // ...async routes anchor [do not remove this code]
];
