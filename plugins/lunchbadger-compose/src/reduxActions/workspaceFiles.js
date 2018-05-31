import {actions} from './actions';
import _ from 'lodash';
import {WorkspaceFilesService} from '../services';

const {coreActions} = LunchBadgerCore.utils;

export const reload = () => async (dispatch) => {
  try {
    const {body} = await WorkspaceFilesService.load();
    return dispatch(actions.updateWorkspaceFiles(body));
  } catch (error) {
    return dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const update = (name, content) => async (dispatch, getState) => {
  const modelFile = {
    files: {
      server: {
        models: {
          [name]: content
        }
      }
    }
  };
  const workspaceFiles = Object.assign(
    _.cloneDeep(getState().entities.workspaceFiles),
    modelFile
  );
  try {
    await WorkspaceFilesService.update(modelFile);
    return dispatch(actions.updateWorkspaceFiles(workspaceFiles));
  } catch (error) {
    return dispatch(coreActions.addSystemDefcon1({error}));
  }
};
