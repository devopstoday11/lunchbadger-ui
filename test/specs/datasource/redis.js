var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Datasource: redis': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('redis', [
        ['HOST', 'dumpHost'],
        ['PORT', '8888'],
        ['NAMESPACE', 'dumpNamespace'],
        ['USERNAME', 'dumpUsername'],
        ['PASSWORD', 'dumpPassword']
      ])
      .closeWhenSystemDefcon1()
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
