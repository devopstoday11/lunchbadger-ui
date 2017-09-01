import {reattach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkMovedConnection = info => (_, getState) => {
  const state = getState();
  const {originalSourceId, newSourceId, newTargetId} = info;
  const isPrivate = storeUtils.isInQuadrant(state, 1, newSourceId);
  const isGateway = storeUtils.findGatewayByPipelineId(state, newTargetId);
  if (isPrivate && isGateway) {
    const previousTargetConnections = Connections.search({toId: storeUtils.formatId(newTargetId)});
    const previousSourceConnections = Connections.search({fromId: storeUtils.formatId(newSourceId)});
    if (previousSourceConnections.length && previousTargetConnections.length) {
      return false;
    } else if (previousTargetConnections.length < 1) {
      return true;
    } else if (previousTargetConnections.length > 0 && previousTargetConnections[0].fromId === storeUtils.formatId(originalSourceId)) {
      return true;
    }
    return false;
  }
  return null;
};

export default [
  new Strategy(checkMovedConnection, reattach),
];
