/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import ReactGA from 'react-ga';
import Config from './config';
import thunk from 'redux-thunk';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.84', [
  [
    'master Bugfix/675 Unauthorized error should logout #677',
    'Feature/676 settings tooltip fix #678',
    'Bugfix/673 Unaligned warnings in code editor #679',
    'Bugfix/62 canvas weird state fix #681'
  ],
  [
    'master Feature/663 Add tooltips to header menu #671',
    'Bugfix/664 Allow editing invalid functions #672',
    'Bugfix/369 Re-labeling database in redis and mongodb #674'
  ],
  [
    'master Hide reinit, restart, resintall button and change walkthrough #670',
    'Feature/663 Add tooltips to header menu #671'
  ],
  [
    'master Bugfix/56 Baking workspace infinite loop #649',
    'Feature/651 Make git access premium feature #668',
    'Bugfix/604 OK needs to be enabled for change in editor #669'
  ]
]);

ReactGA.initialize(Config.get('googleAnalyticsID'), {
  debug: Config.get('googleAnalyticsDebug')
});
ReactGA.pageview(window.location.pathname + window.location.search);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans',
  palette: {
    primary1Color: '#4190cd',
    accent1Color: '#047C99'
  }
});

const AppLoader = LunchBadgerCore.components.AppLoader;
const storeReducers = LunchBadgerCore.utils.storeReducers;
LunchBadgerCore.multiEnvIndex = 0;

const loginManager = LunchBadgerCore.utils.createLoginManager();

loginManager.checkAuth().then(loggedIn => {
  if (!loggedIn) return;
  const {id_token, profile} = loginManager.user;
  ReactGA.set({userId: profile.sub});
  global.ID_TOKEN = id_token; // FIXME: quick and dirty fix for urgent demo
  let middleware = compose(applyMiddleware(thunk));
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const store = createStore(storeReducers(), middleware);
  LunchBadgerCore.services.ConfigStoreService.initialize();
  LunchBadgerCore.services.ProjectService.initialize();
  LunchBadgerCore.services.KubeWatcherService.initialize();
  LunchBadgerCore.services.SshManagerService.initialize();
  (store.getState().plugins.services || []).map(service => service.initialize());
  LunchBadgerCore.isMultiEnv = document.location.search === '?multi';

  // Render the main component into the dom
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppLoader />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  );
});
