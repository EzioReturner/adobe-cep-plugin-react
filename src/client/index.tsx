import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterRender } from 'raturbo-components';
import { Store } from '@store/index';
import { disableReactDevTools } from '@utils/program';
import Error404 from '@views/Exception/404';
import AsyncComponent from '@components/AsyncComponent';
import { SnackbarProvider } from 'notistack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './bridge/controller';
import '@styles/index.less';

// 禁用开发者调试工具
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const App = () => (
  <Provider {...Store}>
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider maxSnack={3}>
        <RouterRender
          routeConfig={Store.layoutStore.routeConfig}
          exception={Error404}
          nodeContainer={({ component, route }, children) => (
            <AsyncComponent componentInfo={component} route={route}>
              {children}
            </AsyncComponent>
          )}
        />
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
