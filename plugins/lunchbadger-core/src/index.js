// stores
import Connections from './stores/Connections';

// components
import App from './components/App/App';
import AppLoader from './components/App/AppLoader';
import Panel from './components/Panel/Panel';
import CanvasElement from './components/CanvasElements/CanvasElement';
import BaseDetails from './components/Panel/EntitiesDetails/BaseDetails';
import CollapsableDetails from './components/Panel/EntitiesDetails/CollapsableDetails';
import CloseButton from './components/Panel/CloseButton';
import SaveButton from './components/Panel/SaveButton';
import Draggable from './components/Draggable/Draggable';
import Modal from './components/Generics/Modal/Modal';
import OneOptionModal from './components/Generics/Modal/OneOptionModal';
import TwoOptionModal from './components/Generics/Modal/TwoOptionModal';
import PortComponent from './components/CanvasElements/Port';
import DraggableGroup from './components/Draggable/DraggableGroup';
import ElementsBundler from './components/CanvasElements/ElementsBundler';

// models
import BaseModel from './models/BaseModel';
import Plugin from './models/Plugin';
import PanelButtonComponent from './models/Plugin/PanelButtonComponent';
import PanelComponent from './models/Plugin/PanelComponent';
import ToolComponent from './models/Plugin/ToolComponent';
import ToolGroupComponent from './models/Plugin/ToolGroupComponent';
import QuadrantComponent from './models/Plugin/QuadrantComponent';
import Port from './models/Port';
import ConnectionModel from './models/Connection';
import PanelDetailsComponent from './models/Plugin/PanelDetailsComponent';
import Strategy from './models/Plugin/Strategy';

// constants
import panelKeys from './constants/panelKeys';
import portGroups from './constants/portGroups';

// services
import ProjectService from './services/ProjectService';
import ConfigStoreService from './services/ConfigStoreService';
import KubeWatcherService from './services/KubeWatcherService';
import SshManagerService from './services/SshManagerService';
import GraphqlService from './services/GraphqlService';

// utils
import ApiClient from './utils/ApiClient';
import LoginManager, {createLoginManager, getUser} from './utils/auth';
import actionsCreator from './utils/actionsCreator';
import {actions, actionTypes} from './reduxActions/actions';
import * as coreActions from './reduxActions';
import messages from './utils/messages';
import checkFields from './utils/checkFields';
import * as storeUtils from './utils/storeUtils';
import storeReducers, {registerPlugin} from './utils/storeReducers';
import diff from './diff';
import requestMethods from './utils/requestMethods';
import userStorage from './utils/userStorage';
import * as UI from './ui';
import './utils/formValidators';
import Config from '../../../src/config';
import reducers from './reducers/reducers';
import plugs from './plugs';

registerPlugin({}, plugs, reducers);

let LunchBadgerCore = {
  UI,
  components: {
    App,
    AppLoader,
    Panel,
    CanvasElement,
    BaseDetails,
    CollapsableDetails,
    CloseButton,
    SaveButton,
    Draggable,
    DraggableGroup,
    Modal,
    OneOptionModal,
    TwoOptionModal,
    Port: PortComponent,
    ElementsBundler
  },
  stores: {
    Connections,
  },
  models: {
    BaseModel,
    Plugin,
    PanelButtonComponent,
    PanelComponent,
    ToolComponent,
    ToolGroupComponent,
    QuadrantComponent,
    Port,
    Connection: ConnectionModel,
    PanelDetailsComponent,
    Strategy
  },
  constants: {
    panelKeys,
    portGroups
  },
  services: {
    ProjectService,
    ConfigStoreService,
    KubeWatcherService,
    SshManagerService,
    GraphqlService
  },
  utils: {
    Config,
    ApiClient,
    actionsCreator,
    actions,
    actionTypes,
    coreActions,
    LoginManager,
    createLoginManager,
    getUser,
    propertyTypes: [
      {label: 'String', value: 'string'},
      {label: 'Number', value: 'number'},
      {label: 'Date', value: 'date'},
      {label: 'Boolean', value: 'boolean'},
      {label: 'GeoPoint', value: 'geopoint'},
      {label: 'Array', value: 'array'},
      {label: 'Object', value: 'object'},
      {label: 'Buffer', value: 'buffer'},
    ],
    gatewayPoliciesOptions: [
      {label: 'OAuth2', value: 'OAuth2'},
      {label: 'Throttling', value: 'Rate limit'},
      {label: 'Logging', value: 'Logging'},
      {label: 'Redirect', value: 'Redirect'},
    ],
    defaultEntityNames: {
      Model: 'NewModel',
      Function_: 'Function',
    },
    messages,
    checkFields,
    storeUtils,
    storeReducers,
    registerPlugin,
    diff,
    requestMethods,
    userStorage,
  },
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCore = LunchBadgerCore;
}

module.exports = LunchBadgerCore;
