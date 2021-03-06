import _ from 'lodash';
import {update, remove} from '../reduxActions/apis';
import APIPlan from './APIPlan';

const ApiEndpoint = LunchBadgerManage.models.ApiEndpoint;
const BaseModel = LunchBadgerCore.models.BaseModel;
const {Connections} = LunchBadgerCore.stores;

export default class API extends BaseModel {
  static type = 'API';
  static entities = 'apis';

  /**
   * @type {Endpoint[]}
   * @private
   */
  _apiEndpoints = [];

  /**
   * @type {APIPlan[]}
   * @private
   */
  _plans = [];

  _accept = [ApiEndpoint.type];

  constructor(id, name) {
    super(id);
    const defaultPlans = [
      APIPlan.create({name: 'Free', icon: 'fa-paper-plane'}),
      APIPlan.create({name: 'Developer', icon: 'fa-plane'}),
      APIPlan.create({name: 'Professional', icon: 'fa-fighter-jet'})
    ];
    this.name = name;
    this.plans = defaultPlans.slice();
  }

  recreate() {
    return API.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      apiEndpoints: this.apiEndpoints.map(endpoint => endpoint.toJSON()),
      plans: this.plans.map(plan => plan.toJSON()),
      itemOrder: this.itemOrder,
      portalId: this.portalId
    }
  }

  get isZoomDisabled() {
    return true;
  }

  /**
   * @param endpoints {Endpoint[]}
   */
  set apiEndpoints(endpoints) {
    this._apiEndpoints = endpoints.map((endpoint) => {
      endpoint.wasBundled = true;
      return ApiEndpoint.create(endpoint);
    });
  }

  /**
   * @returns {Endpoint[]}
   */
  get apiEndpoints() {
    return this._apiEndpoints;
  }

  /**
   * @param plans {APIPlan[]}
   */
  set plans(plans) {
    this._plans = plans.map((plan) => {
      return APIPlan.create(plan);
    });
  }

  /**
   * @returns {APIPlan[]}
   */
  get plans() {
    return this._plans;
  }

  /**
   * @param endpoint {Endpoint}
   */
  addEndpoint(endpoint) {
    endpoint.wasBundled = true;
    this._apiEndpoints.push(endpoint);
  }

  addEndpoints(endpoints) {
    endpoints.forEach(endpoint => this.addEndpoint(endpoint));
  }

  removeEndpoint(endpoint) {
    this._apiEndpoints.splice(_.findIndex(this.apiEndpoints, {id: endpoint.id}), 1);
  }

  removeEndpoints(endpoints) {
    endpoints.forEach(endpoint => this.removeEndpoint(endpoint));
  }

  /**
   * @param plan {APIPlan}
   */
  addPlan(plan) {
    this._plans.push(plan);
  }

  /**
   * @param plan {APIPlan}
   */
  removePlan(plan) {
    this._plans.splice(_.findIndex(this.plans, {id: plan.id}), 1);
  }

  get accept() {
    return this._accept;
  }

  get ports() {
    return this.apiEndpoints
      .map(apiEndpoint => apiEndpoint.ports)
      .reduce((prev, curr) => [...prev, ...curr], []);
  }

  getHighlightedPorts(selectedSubelementIds = []) {
    return this.apiEndpoints
      .filter(apiEndpoin => selectedSubelementIds.length === 0
        ? true
        : selectedSubelementIds.includes(apiEndpoin.id)
      )
      .map(apiEndpoint => apiEndpoint.ports)
      .reduce((prev, curr) => [...prev, ...curr], []);
  }

  get apiEndpointsNames() {
    return this.apiEndpoints.reduce((map, {id, name}) => [...map, {id, name}], []);
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.apis;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('API');
        }
      }
      const fields = ['name'];
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
