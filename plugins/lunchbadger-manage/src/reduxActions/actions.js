const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'updateServiceEndpoint',
    'updateServiceEndpoints',
    'removeServiceEndpoint',

    'updateApiEndpoint',
    'updateApiEndpoints',
    'removeApiEndpoint',

    'updateGateway',
    'updateGateways',
    'removeGateway',
    'addPipeline',
    'removePipeline',
    'unlockGatewayAdminApi',
  ],
);

export {
  actions,
  actionTypes,
};
