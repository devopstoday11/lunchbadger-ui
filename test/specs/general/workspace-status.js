var page;

module.exports = {
  'Workspace status': function(browser) {
    page = browser.page.lunchBadger();
    page.open();

    // OK by default
    page.expect.element('.workspace-status').to.be.present;
    browser.waitForElementPresent('.workspace-status .workspace-status__success', 120000);

    // info panel shows OK status
    page.moveToElement('.workspace-status', 5, 5, function () {
      page.waitForElementPresent('.ContextualInformationMessage.Workspace-OK', 3000);
      page.expect.element('.ContextualInformationMessage.Workspace-OK .rc-tooltip-inner').text.to.contain('Workspace OK');
    });

    // info panel can close
    page.moveToElement('.header', 5, 5, function () {
      page.waitForElementNotPresent('.ContextualInformationMessage.Workspace-OK', 3000);
    });

    page.close();
  }
}
