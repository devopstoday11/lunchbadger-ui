var page;

function expectStatus(browser, status) {
  browser.waitForElementVisible('.workspace-status .workspace-status__progress', 120000);
  browser.waitForElementPresent(`.workspace-status .workspace-status__${status}`, 5 * 60 * 1000);
  if (status === 'failure') {
    browser.click('.workspace-status span');
    browser.waitForElementPresent('.SystemDefcon1 .SystemDefcon1__box__content__details--box', 5000);
    page.expect.element('.SystemDefcon1 .SystemDefcon1__box__content__details--box').text.to.contain('ENOTFOUND');
  }
}

module.exports = {
  // '@disabled': true,
  'Connector installation: data source add': function(browser) {
    page = browser.page.lunchBadger();
    page.open();
    browser.click('.workspace-status span');
    page.addElementFromTooltip('dataSource', 'rest');
    page.setValueSlow(page.getDataSourceSelector(1) + ' .input__operations0templateurl input', 'http://dumpUrl');
    page.submitCanvasEntity(page.getDataSourceSelector(1));
    expectStatus(browser, 'success');
  },

  'Connector installation: add more data source': function(browser) {
    page.addElementFromTooltip('dataSource', 'soap');
    page.setValueSlow(page.getDataSourceSelector(2) + ' .input__url input', 'http://dumpUrl');
    page.submitCanvasEntity(page.getDataSourceSelector(2));
    browser.waitForElementPresent('.SystemDefcon1', 5 * 60 * 1000);
    browser.click('.SystemDefcon1 button');
    browser.waitForElementNotPresent('.SystemDefcon1', 5000);
    page.addElementFromTooltip('dataSource', 'mongodb');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__host input', 'dumpUrl');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__port input', '9999');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__database input', 'dumpDatabase');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__username input', 'dumpUsername');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__password input', 'dumpPassword');
    page.submitCanvasEntity(page.getDataSourceSelector(3));
    expectStatus(browser, 'failure');
  },

  'Connector uninstallation: remove datasource': function(browser) {
    browser.click('.SystemDefcon1 button');
    browser.waitForElementNotPresent('.SystemDefcon1', 5000);
    browser.click(page.getDataSourceSelector(3));
    browser.waitForElementVisible(page.getDataSourceSelector(3) + ' .Toolbox__button--delete', 50000);
    browser.click(page.getDataSourceSelector(3) + ' .Toolbox__button--delete');
    browser.waitForElementPresent('.ConfirmModal .confirm', 5000);
    browser.click('.ConfirmModal .confirm');
    expectStatus(browser, 'failure');
  },

  'Connector uninstallation: trash workspace and reload page': function(browser) {
    browser.click('.SystemDefcon1 button');
    browser.click('.header__menu__element .fa-trash-o');
    browser.refresh(function () {
      expectStatus(browser, 'success');
    });
  },

  after: function() {
    page.close();
  }
}
