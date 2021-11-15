import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterRender } from 'raturbo-components';
import { Store } from '@store/index';
import { disableReactDevTools } from '@utils/program';
import '@styles/index.less';
import 'moment/locale/zh-cn';
import Error404 from '@views/Exception/404';
import AsyncComponent from '@components/AsyncComponent';

// 禁用开发者调试工具
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const App = () => (
  <Provider {...Store}>
    <RouterRender
      routeConfig={Store.layoutStore.routeConfig}
      exception={Error404}
      nodeContainer={({ component, route }, children) => (
        <AsyncComponent componentInfo={component} route={route}>
          {children}
        </AsyncComponent>
      )}
    />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
