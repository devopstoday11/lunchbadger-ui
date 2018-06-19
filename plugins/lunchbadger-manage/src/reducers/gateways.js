import slug from 'slug';
import Gateway from '../models/Gateway';
import {actionTypes} from '../reduxActions/actions';
import Pipeline from '../models/Pipeline';

const {actionTypes: coreActionTypes, userStorage} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.gateways.reduce((map, item) => {
        delete item.running;
        delete item.fake;
        delete item.deleting;
        map[item.id] = Gateway.create(item);
        return map;
      }, {});
    case actionTypes.updateGateway:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateGateways:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeGateway:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      if (action.payload) return {};
      Object.keys(newState).forEach((key) => {
        newState[key] = Gateway.create(newState[key]);
        newState[key].deleting = true;
        if (!newState[key].fake) {
          userStorage.setObjectKey('gateway', slug(newState[key].name, {lower: true}), newState[key]);
        }
      });
      return newState;
    case actionTypes.addPipeline:
      newState[action.payload].pipelines = [
        ...newState[action.payload].pipelines,
        Pipeline.create(),
      ];
      return newState;
    default:
      return state;
  }
};
