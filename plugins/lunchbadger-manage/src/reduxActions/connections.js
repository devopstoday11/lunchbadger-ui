import {addAndConnect} from './apiEndpoints';
import {addServiceEndpointIntoProxy, removeServiceEndpointFromProxy} from './gateways';

const {coreActions, storeUtils} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const attach = info => async (dispatch, getState) => {
  info.connection.addType('wip');
  const {sourceId, targetId} = info;
  const discardAutoSave = info.source.classList.contains('discardAutoSave');
  const endpoint = storeUtils.findEntity(getState(), 1, sourceId);
  if (endpoint) {
    const pipelineId = storeUtils.formatId(targetId);
    dispatch(addServiceEndpointIntoProxy(endpoint, pipelineId));
    if (!Connections.findHistory({fromId: endpoint.id, toId: pipelineId})) {
      const outPort = document.getElementById(`port_out_${pipelineId}`).querySelector('.port__anchor');
      dispatch(addAndConnect(endpoint, pipelineId, outPort));
    }
  }
  Connections.addConnectionByInfo(info);
  info.connection.removeType('wip');
  if (discardAutoSave) {
    info.source.classList.remove('discardAutoSave');
  } else {
    await dispatch(coreActions.saveToServer());
  }
};

export const detach = info => async (dispatch, getState) => {
  const {sourceId, targetId} = info;
  const discardAutoSave = info.source.classList.contains('discardAutoSave');
  if (discardAutoSave) {
    info.source.classList.remove('discardAutoSave');
  }
  const endpoint = storeUtils.findEntity(getState(), 1, sourceId);
  if (endpoint) {
    const pipelineId = storeUtils.formatId(targetId);
    dispatch(removeServiceEndpointFromProxy(endpoint.id, pipelineId));
  }
  Connections.removeConnection(sourceId, targetId);
  if (!discardAutoSave) {
    await dispatch(coreActions.saveToServer());
  }
};

export const reattach = info => async (dispatch, getState) => {
  info.connection.addType('wip');
  const {originalSourceId, originalTargetId, newSourceId, newTargetId} = info;
  const oldEndpoint = storeUtils.findEntity(getState(), 1, originalSourceId);
  const newEndpoint = storeUtils.findEntity(getState(), 1, newSourceId);
  if (newEndpoint) {
    const oldPipelineId = storeUtils.formatId(originalTargetId);
    const newPipelineId = storeUtils.formatId(newTargetId);
    dispatch(removeServiceEndpointFromProxy(oldEndpoint.id, oldPipelineId));
    dispatch(addServiceEndpointIntoProxy(newEndpoint, newPipelineId));
    if (!Connections.findHistory({fromId: newEndpoint.id, toId: newPipelineId})) {
      const outPort = document.getElementById(`port_out_${newPipelineId}`).querySelector('.port__anchor');
      await dispatch(addAndConnect(newEndpoint, newPipelineId, outPort));
    }
  }
  Connections.moveConnection(info);
  info.connection.removeType('wip');
  await dispatch(coreActions.saveToServer());
}
