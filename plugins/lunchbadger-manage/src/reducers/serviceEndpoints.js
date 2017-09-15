import ServiceEndpoint from '../models/ServiceEndpoint';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return (action.payload.body.serviceEndpoints || []).reduce((map, item) => {
        map[item.id] = ServiceEndpoint.create(item);
        return map;
      }, {});
    case actionTypes.updateServiceEndpoint:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateServiceEndpoints:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeServiceEndpoint:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
