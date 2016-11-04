const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Model = LunchBadgerManage.models.Model;

export default (name) => {
  dispatch('AddModel', {
    entity: Model.create({
      name: name || 'Model'
    })
  });
};
