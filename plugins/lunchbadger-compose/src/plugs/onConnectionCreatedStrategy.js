import {attach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkConnection = (info) => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isBackend = storeUtils.isInQuadrant(state, 0, sourceId);
  const isPrivate = storeUtils.isInQuadrant(state, 1, targetId);
  if (isBackend && isPrivate) {
    return !Connections.search({toId: storeUtils.formatId(targetId)}).length;
  }
  return null;
};

export default [
  new Strategy(checkConnection, attach),
];