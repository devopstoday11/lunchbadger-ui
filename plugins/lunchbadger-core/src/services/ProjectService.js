import ApiClient from '../utils/ApiClient';
import {bindParams} from '../utils/URLParamsBind';

export default class ProjectService {
  constructor(projectUrl, workspaceUrl, idToken) {
    this._projectClient = new ApiClient(projectUrl, idToken);
    this._workspaceClient = new ApiClient(workspaceUrl, idToken);
  }

  get(userName, envId) {
    let projectId = `${userName}-${envId}`;

    return Promise.all([
      this._projectClient.get(bindParams('Projects/:id', {id: projectId})),
      this._workspaceClient.get('Facets/server/models?filter[include]=properties&filter[include]=relations'),
      this._workspaceClient.get('Facets/server/datasources'),
      this._workspaceClient.get('Facets/server/modelConfigs')
    ]);
  }

  upsertDataSource(data) {
    return this._workspaceClient.post('DataSourceDefinitions', { body: data });
  }

  deleteDataSource(id) {
    return this._workspaceClient.delete(
      bindParams('DataSourceDefinitions/:id', {id}));
  }

  upsertModel(data) {
    return this._workspaceClient.post('ModelDefinitions', { body: data });
  }

  deleteModel(id) {
    return this._workspaceClient.delete(
      bindParams('ModelDefinitions/:id', {id}));
  }

  upsertModelConfig(data) {
    return this._workspaceClient.post('ModelConfigs', { body: data });
  }

  deleteModelConfig(id) {
    return this._workspaceClient.delete(bindParams('ModelConfigs/:id', {id}));
  }

  upsertModelProperties(data) {
    return this._workspaceClient.post('ModelProperties', { body: data });
  }

  deleteModelProperties(modelId) {
    return this._workspaceClient.delete(
      bindParams('ModelDefinitions/:id/properties', {id: modelId}));
  }

  upsertModelRelations(data) {
    return this._workspaceClient.post('ModelRelations', { body: data });
  }

  deleteModelRelations(modelId) {
    return this._workspaceClient.delete(
      bindParams('ModelDefinitions/:id/relations', {id: modelId}));
  }

  save(userName, envId, data) {
    let projectId = `${userName}-${envId}`;
    return this._projectClient.patch('Projects', { body: {
      id: projectId,
      ...data
    }});
  }

  clearProject(userName, envId) {
    let projectId = `${userName}-${envId}`;
    return this._projectClient.post(
      bindParams('Projects/:id/clear', { id: projectId }));
  }

  monitorStatus() {
    return this._projectClient.get('/WorkspaceStatus/1').then(res => {
      return {
        initial: res.body,
        es: this._projectClient.eventSource('/WorkspaceStatus/change-stream')
      };
    });
  }
}
