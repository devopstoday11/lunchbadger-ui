module.exports = {
  // '@disabled': true,
  'Datasource: soap': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('soap', [
      ['BASE URL', 'dumpUrl']
    ]);
    page.close();
  }
};
