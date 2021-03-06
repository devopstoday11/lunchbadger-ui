var page;
var entitySelector;
var entitySelector2;

module.exports = {
  '@disabled': true,
  'Tritonobjectstorage': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    entitySelector2 = page.getDataSourceSelector(2);
    page
      .open()
      .testDatasource('tritonobjectstorage', [
        ['LunchBadgerurl', 'http://test.com'],
        ['LunchBadgeruser', 'dumpUser'],
        ['LunchBadgersubuser', 'dumpSubUser'],
        ['LunchBadgerkeyId', 'dumpKeyId']
      ], [
        'LunchBadger\\[url\\]',
        'LunchBadger\\[user\\]',
        'LunchBadger\\[database\\]',
        'LunchBadger\\[username\\]'
      ]);
  },
  'Tritonobjectstorage: unique name check': function () {
    page
      .addElementFromTooltip('dataSource', 'memory')
      .setCanvasEntityName(entitySelector2, 'tritonobjectstorage')
      .expectUniqueNameError(entitySelector2, 'A model connector')
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};
