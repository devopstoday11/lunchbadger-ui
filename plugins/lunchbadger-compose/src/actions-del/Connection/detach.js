// const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
// const Connection = LunchBadgerCore.stores.Connection;
// const Private = LunchBadgerManage.stores.Private;
// const handleFatals = LunchBadgerCore.utils.handleFatals;
// const ProjectService = LunchBadgerCore.services.ProjectService;
//
// export default (connectionInfo) => {
//   let {sourceId, targetId} = connectionInfo;
//   let model = Private.findEntity(Connection.formatId(targetId));
//   let modelConfig = {
//     name: model.name,
//     id: `server.${model.name}`,
//     facetName: 'server',
//     dataSource: null,
//     public: model.public
//   };
//   dispatch('RemoveConnection', {
//     from: sourceId,
//     to: targetId
//   });
//   handleFatals(ProjectService.upsertModelConfig(modelConfig));
// };