var page;
var memorySelector;
var modelSelector;
var functionSelector;
var gatewaySelector;
var carApiEndpointSelector;
var myfunctionApiEndpointSelector;
module.exports = {
  '@disabled': true,
  'Walkthrough: demo wizard process': function(browser) {
    page = browser.page.lunchBadger();
    memorySelector = page.getDataSourceSelector(1);
    modelSelector = page.getModelSelector(1);
    functionSelector = page.getFunctionSelector(2);
    gatewaySelector = page.getGatewaySelector(1);
    carApiEndpointSelector = page.getApiEndpointSelector(1);
    myfunctionApiEndpointSelector = page.getApiEndpointSelector(2);
    page
      .openWithDemoWizard()
      .hideDrift()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .clickDemoWizardHole()
      .clickDemoWizardHole()
      .setCanvasEntityName(modelSelector, 'Car')
      .setField(modelSelector, 'httppath', 'cars')
      .clickDemoWizardHole()
      .setModelPropertyOnCanvas(modelSelector, 0, 'year')
      .clickDemoWizardHole()
      .selectValueOptionSlow(modelSelector, 'properties0type', 'Number')
      .pause(3000)
      .submitCanvasEntityWithoutAutoSave(modelSelector)
      .waitForEntityDeployed(modelSelector)
      .pause(3000)
      .connectPortsWithoutAutoSave(memorySelector, 'out', modelSelector, 'in')
      .clickDemoWizardHole()
      .clickDemoWizardHole()
      .waitForEntityDeployed(functionSelector)
      .pause(3000)
      .clickDemoWizardHole()
      .pause(7000)
      .visible('.DetailsPanel.visible .panel .BaseDetails.general', 15000)
      .pause(7000)
      .visible('.DetailsPanel .cancel')
      .visible('.DetailsPanel .FilesEditor')
      .visible('.joyride-tooltip[data-target=".DetailsPanel .FilesEditor"]')
      .pause(7000)
      .clickDemoWizardNext()
      .notPresent('.joyride-tooltip[data-target=".DetailsPanel .FilesEditor"]')
      .pause(7000)
      .visible('.joyride-tooltip[data-target=".DetailsPanel .cancel"]')
      .pause(3000)
      .clickDemoWizardHole()
      .pause(3000)
      .clickDemoWizardHole()
      .clickDemoWizardNext()
      .setField(gatewaySelector, 'pipelines0name', 'CarPipeline')
      .pause(3000)
      .clickDemoWizardHole()
      .pause(3000)
      .setField(gatewaySelector, 'pipelines1name', 'FunctionPipeline')
      .pause(3000)
      .clickDemoWizardHole()
      .waitForEntityDeployed(gatewaySelector)
      .autoSave()
      .pause(7000)
      .clickDemoWizardNext()
      .pause(3000)
      .connectPorts(modelSelector, 'out', gatewaySelector, 'in', 0)
      .pause(7000)
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .setField(carApiEndpointSelector, 'paths0', '/cars*')
      .pause(3000)
      .submitCanvasEntityWithoutAutoSave(carApiEndpointSelector)
      .autoSave()
      .pause(7000)
      .connectPorts(functionSelector, 'out', gatewaySelector, 'in', 1)
      .pause(7000)
      .clickDemoWizardHole()
      .setField(myfunctionApiEndpointSelector, 'paths0', '/myfunction*')
      .pause(3000)
      .submitCanvasEntityWithoutAutoSave(myfunctionApiEndpointSelector)
      .autoSave()
      .showDrift()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .present('.joyride-tooltip[data-target=".header__menu__link.SETTINGS_PANEL"]')
      .pause(3000)
      .clickDemoWizardHole()
      .pause(7000)
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .pause(7000)
      .notPresent('.joyride')
      .notPresent('.Walkthrough')
      .close();
  }
};
