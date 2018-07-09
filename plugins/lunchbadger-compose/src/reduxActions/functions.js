import slug from 'slug';
import {actions} from './actions';
import {SLSService} from '../services';
import Function_ from '../models/Function';
import {runtimeMapping} from '../utils';

const {coreActions, actions: actionsCore, userStorage} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Function_.create({name: 'myfunction', itemOrder, loaded: false});
  dispatch(actions.updateFunction(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const {loaded, id, itemOrder} = entity;
  const {name, runtime} = model;
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Function_.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const data = {
    ...entity.toJSON(),
    ...model,
    ready: false,
    running: null,
  };
  if (!data.service.serverless) {
    data.service.serverless = {provider: {runtime: runtimeMapping(runtime, true).sls}};
  }
  updatedEntity = Function_.create(data);
  dispatch(actions.updateFunction(updatedEntity));
  updatedEntity = updatedEntity.recreate();
  try {
    if (!loaded) {
      const [env, version] = runtime.toLowerCase().split(' ');
      const slsCreate = await SLSService.create({name, env, version, lunchbadger: {id, itemOrder}});
      updatedEntity.service = slsCreate.body;
    } else {
      updatedEntity.service = model.service;
    }
    const slsDeploy = await SLSService.update(name, updatedEntity.service);
    updatedEntity.service = slsDeploy.body;
    await dispatch(coreActions.saveToServer({saveProject: false}));
    await SLSService.deploy(name);
    updatedEntity.running = true;
  } catch (error) {
    updatedEntity.running = false;
    dispatch(coreActions.addSystemDefcon1({error}));
  }
  updatedEntity.ready = true;
  dispatch(actions.updateFunction(updatedEntity));
  return updatedEntity;
};

export const remove = (entity, cb) => async (dispatch) => {
  const updatedEntity = entity.recreate();
  updatedEntity.deleting = true;
  userStorage.setObjectKey('function', slug(entity.name, {lower: true}), updatedEntity.toJSON());
  dispatch(actions.updateFunction(updatedEntity));
  try {
    if (entity.loaded) {
      await SLSService.remove(entity.name);
      if (cb) {
        await dispatch(cb());
      }
      await dispatch(coreActions.saveToServer({saveProject: false}));
    } else {
      dispatch(actions.removeFunction(entity));
    }
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.functions;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      entity.service.serverless.lunchbadger.itemOrder = entity.itemOrder;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateFunctions(reordered));
    try {
      await Promise.all(reordered.map(({name, service}) => SLSService.update(name, service)));
    } catch (error) {
      dispatch(coreActions.addSystemDefcon1({error}));
    }
  }
};

export const clearService = () => async () => {
  await SLSService.clear();
};
