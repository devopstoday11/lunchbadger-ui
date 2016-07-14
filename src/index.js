/**
 * This file is entry point for each plugin
 * You need to import this file to get access to core api and base elements
 */

// dispatcher
import * as AppDispatcher from './dispatcher/AppDispatcher';

// stores
import BaseStore from './stores/BaseStore';
import AppState from './stores/AppState';
import Pluggable from './stores/Pluggable';
import Connection from './stores/Connection';

// components
import App from './components/App/App';
import Panel from './components/Panel/Panel';
import CanvasElement from './components/CanvasElements/CanvasElement';
import BaseDetails from './components/Panel/EntitiesDetails/BaseDetails';
import Input from './components/Generics/Form/Input';
import Checkbox from './components/Generics/Form/Checkbox';
import Select from './components/Generics/Form/Select';
import CloseButton from './components/Panel/CloseButton';
import SaveButton from './components/Panel/SaveButton';
import Draggable from './components/Draggable/Draggable';
import Modal from './components/Generics/Modal/Modal';
import TwoOptionModal from './components/Generics/Modal/TwoOptionModal';
import Quadrant from './components/Quadrant/Quadrant';
import ToolGroup from './components/Tools/ToolGroup';
import Tool from './components/Tools/Tool';
import PortComponent from './components/CanvasElements/Port';

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

// actions
import registerPlugin from './actions/registerPlugin';
import togglePanel from './actions/togglePanel';
import toggleHighlight from './actions/CanvasElements/toggleHighlight';
import toggleEdit from './actions/CanvasElements/toggleEdit';
import attachConnection from './actions/Connection/attach';
import reattachConnection from './actions/Connection/reattach';
import setProject from './actions/Stores/AppState/setProject';
import initializeAppState from './actions/Stores/AppState/initialize';

// constants
import panelKeys from './constants/panelKeys';
import portGroups from './constants/portGroups';

// services
import ProjectService from './services/ProjectService';

// utils
import APIInterceptor from './utils/APIInterceptor';
import * as URLParams from './utils/URLParamsBind';
import {waitForStores} from './utils/waitForStores';

let LunchBadgerCore = {
  dispatcher: {
    AppDispatcher: AppDispatcher
  },
  actions: {
    registerPlugin: registerPlugin,
    togglePanel: togglePanel,
    toggleHighlight: toggleHighlight,
    toggleEdit: toggleEdit,
    Connection: {
      attachConnection: attachConnection,
      reattachConnection: reattachConnection
    },
    Stores: {
      AppState: {
        setProject: setProject,
        initialize: initializeAppState
      }
    }
  },
  components: {
    App: App,
    Panel: Panel,
    CanvasElement: CanvasElement,
    BaseDetails: BaseDetails,
    Input: Input,
    Checkbox: Checkbox,
    Select: Select,
    CloseButton: CloseButton,
    SaveButton: SaveButton,
    Draggable: Draggable,
    Modal: Modal,
    TwoOptionModal: TwoOptionModal,
    Quadrant: Quadrant,
    Tool: Tool,
    ToolGroup: ToolGroup,
    Port: PortComponent
  },
  stores: {
    BaseStore: BaseStore,
    AppState: AppState,
    Pluggable: Pluggable,
    Connection: Connection
  },
  models: {
    BaseModel: BaseModel,
    Plugin: Plugin,
    PanelButtonComponent: PanelButtonComponent,
    PanelComponent: PanelComponent,
    ToolComponent: ToolComponent,
    ToolGroupComponent: ToolGroupComponent,
    QuadrantComponent: QuadrantComponent,
    Port: Port,
    Connection: ConnectionModel,
    PanelDetailsComponent: PanelDetailsComponent,
    Strategy: Strategy
  },
  constants: {
    panelKeys: panelKeys,
    portGroups: portGroups
  },
  services: {
    ProjectService: ProjectService
  },
  utils: {
    APIInterceptor: APIInterceptor,
    URLParams: URLParams,
    waitForStores: waitForStores
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCore = LunchBadgerCore;
}

module.exports = LunchBadgerCore;
