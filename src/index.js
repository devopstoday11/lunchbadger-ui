/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';
import config from 'config';
import reducers from './reducers';

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


global.LUNCHBADGER_CONFIG = config;
const AppLoader = LunchBadgerCore.components.AppLoader;
const ConfigStoreService = LunchBadgerCore.services.ConfigStoreService;
LunchBadgerCore.multiEnvIndex = 0;

console.info('Application started..!');

let loginManager = LunchBadgerCore.utils.createLoginManager(config);

loginManager.checkAuth().then(loggedIn => {
  if (!loggedIn) {
    return;
  }

  let user = loginManager.user;

  global.ID_TOKEN = user.id_token; // FIXME: quick and dirty fix for urgent demo

  config.forecastApiUrl = config.forecastApiUrl.replace('{USER}', user.profile.sub).replace('{ENV}', config.envId);

  // userengage.io integration
  window.civchat = {
    apiKey: 'AlZAHWKR9vzs2AFoZrg3WhtRYFNIGYPmJrxRjOaUYI1gIgvl5mf4erFfe7wBcHLZ',
    name: user.profile.preferred_username,
    email: user.profile.email,
    state: 'simple'
  };

  let configStoreService = new ConfigStoreService(config.configStoreApiUrl,
    user.id_token);

  let store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  LunchBadgerCore.isMultiEnv = document.location.search === '?multi';
  LunchBadgerCore.isDataSourceFeature = document.location.search === '?ds';

  // Render the main component into the dom
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppLoader
          config={config}
          loginManager={loginManager}
          configStoreService={configStoreService}
        />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  );
});
