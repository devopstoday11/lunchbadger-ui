import Button from './Button/Button';
import CollapsibleProperties from './CollapsibleProperties/CollapsibleProperties';
import IconSVG from './IconSVG/IconSVG';
import Toolbox from './Toolbox/Toolbox';
import ContextualInformationMessage from './ContextualInformationMessage/ContextualInformationMessage';
import ContextualMenu from './ContextualMenu/ContextualMenu';
import SystemDefcon1 from './SystemDefcon1/SystemDefcon1';
import SystemInformationMessages from './SystemInformationMessages/SystemInformationMessages';
import SystemNotifications from './SystemNotifications/SystemNotifications';
import TopBar from './Header/TopBar/TopBar';
import PanelBar from './Header/PanelBar/PanelBar';

import Entity from './Entity/Entity';
import EntityProperties from './Entity/EntityProperties/EntityProperties';
import EntityProperty from './Entity/EntityProperty/EntityProperty';
import EntityPropertyLabel from './Entity/EntityPropertyLabel/EntityPropertyLabel';
import EntitySubElements from './Entity/EntitySubElements/EntitySubElements';
import EntityValidationErrors from './Entity/EntityValidationErrors/EntityValidationErrors';

import Input from './Form/Input';
import Checkbox from './Form/Checkbox';

import SmoothCollapse from './utils/SmoothCollapse/SmoothCollapse';
import {Form} from './utils/Formsy/main';

// entities icons
import iconApi from '../../../src/icons/icon-api.svg';
import iconDatasource from '../../../src/icons/icon-datasource.svg';
import iconEndpoint from '../../../src/icons/icon-endpoint.svg';
import iconGateway from '../../../src/icons/icon-gateway.svg';
import iconMicroservice from '../../../src/icons/icon-microservice.svg';
import iconModel from '../../../src/icons/icon-model.svg';
import iconPortal from '../../../src/icons/icon-portal.svg';

const entityIcons = {
  API: iconApi,
  DataSource: iconDatasource,
  Gateway: iconGateway,
  Microservice: iconMicroservice,
  Model: iconModel,
  Portal: iconPortal,
  PrivateEndpoint: iconEndpoint,
  PublicEndpoint: iconEndpoint,
};

export {
  Button,
  Checkbox,
  CollapsibleProperties,
  ContextualInformationMessage,
  ContextualMenu,
  Entity,
  EntityProperties,
  EntityProperty,
  EntityPropertyLabel,
  EntitySubElements,
  EntityValidationErrors,
  Form,
  IconSVG,
  Input,
  PanelBar,
  SmoothCollapse,
  SystemDefcon1,
  SystemInformationMessages,
  SystemNotifications,
  Toolbox,
  TopBar,
  entityIcons,
};

// if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
//   global.LunchBadgerUI = LunchBadgerUI;
// }
//
// module.exports = LunchBadgerUI;
