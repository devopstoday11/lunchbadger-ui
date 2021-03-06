import _ from 'lodash';
import {update, remove} from '../reduxActions/portals';
import API from './API';

const BaseModel = LunchBadgerCore.models.BaseModel;
const {Connections} = LunchBadgerCore.stores;

export default class Portal extends BaseModel {
  static type = 'Portal';
  static entities = 'portals';

  /**
   * @type {API[]}
   * @private
   */
  _apis = [];

	/**
   * @type {string}
   * @private
   */
  _rootUrl = '';

  _accept = [API.type];

  constructor(id, name, url = 'http://') {
    super(id);
    this.name = name;
    this.rootUrl = url;
  }

  recreate() {
    return Portal.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      apis: this.apis.map(api => api.toJSON()),
      rootUrl: this.rootUrl,
      itemOrder: this.itemOrder
    }
  }

  get isZoomDisabled() {
    return true;
  }

  /**
   * @param apis {API[]}
   */
  set apis(apis) {
    this._apis = apis.map((api) => {
      api.wasBundled = true;
      return API.create(api);
    });
  }

  /**
   * @returns {API[]}
   */
  get apis() {
    return this._apis;
  }

  /**
   * @param api {API}
   */
  addAPI(api) {
    api.wasBundled = true;
    this._apis.push(api);
  }

  addAPIs(apis) {
    apis.forEach(api => this.addAPI(api));
  }

  removeAPI(api) {
    this._apis.splice(_.findIndex(this.apis, {id: api.id}), 1);
  }

  removeAPIs(apis) {
    apis.forEach(api => this.removeAPI(api));
  }

  get accept() {
    return this._accept;
  }

  get apiEndpoints() {
    return this._apis.reduce((endpoints, api) => endpoints.concat(api.apiEndpoints), []);
  }

  get apiEndpointsNames() {
    return this.apiEndpoints.reduce((map, {id, name}) => [...map, {id, name}], []);
  }

  get rootUrl() {
    return this._rootUrl;
  }

  set rootUrl(url) {
    this._rootUrl = url;
  }

  get ports() {
    return this.apis
      .map(api => api.ports)
      .reduce((prev, curr) => [...prev, ...curr], []);
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.portals;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Portal');
        }
      }
      const fields = ['name', 'rootUrl'];
      checkFields(fields, model, validations.data);
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  update(model) {
    return async dispatch => await dispatch(update(this, model));
  }

  remove() {
    return async dispatch => await dispatch(remove(this));
  }

  beforeRemove(paper) {
    (this.apiEndpoints || []).forEach(({id}) => {
      const connectionsTo = Connections.search({toId: id});
      connectionsTo.map((conn) => {
        conn.info.source.classList.add('discardAutoSave');
        paper.detach(conn.info.connection);
      });
    });
  }

}
