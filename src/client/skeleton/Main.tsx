import React, { Suspense } from 'react';
import Authorized from '@components/Authorized';
import { useLocation } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import LayoutStore from '@store/layoutStore';
import { getRouteAuthority } from '@utils/authorityTools';
import { Spin, Layout } from 'raturbo-components';
import SiderMenu from './components/SiderMenu';
import UserInfo from './components/UserInfo';
import './Main.less';
import './components/styles/index.less';

const Exception403 = React.lazy(() => import(/* webpackChunkName: "403" */ '@views/Exception/403'));

interface MainSkeletonProps {
  route: RouteRoot;
}

interface InjectProps extends MainSkeletonProps {
  layoutStore: LayoutStore;
}

const MainSkeleton: React.FC<MainSkeletonProps> = props => {
  const {
    layoutStore: {
      toggleCollapsed,
      loadingOptions,
      layoutStatus: { collapsed }
    }
  } = props as InjectProps;

  let location = useLocation();

  const { route, children } = props;
  const routeAuthority: undefined | string | string[] = getRouteAuthority(
    location.pathname,
    route.routes
  );

  const Content = (
    <Authorized
      routeAuthority={routeAuthority}
      unidentified={
        <Suspense fallback={<Spin spinning />}>
          <Exception403 />
        </Suspense>
      }
    >
      <div className="LK-basicLayout-wrapper-viewMain">
        <Spin {...{ ...loadingOptions, parentRelative: true }} />
        {children}
      </div>
    </Authorized>
  );

  return (
    <main style={{ height: '100%' }}>
      <Layout
        collapsed={collapsed}
        onChangeCollapsed={col => toggleCollapsed(col)}
        fixHeader
        fixSider
        sider={<SiderMenu />}
        header={<UserInfo />}
      >
        {Content}
      </Layout>
    </main>
  );
};

export default inject('layoutStore')(observer(MainSkeleton));
