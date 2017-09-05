var page;

function getDataSourceSelector (nth) {
  return '.quadrant:first-child .Entity.DataSource:nth-child(' + nth + ')';
}

function getModelSelector (nth) {
  return '.quadrant:nth-child(2) .Entity.Model:nth-child(' + nth + ')';
}

function getDataSourceFieldSelector (nth) {
  return getDataSourceSelector(2) + '.editable .EntityProperties .EntityProperty:nth-child(' + nth + ') .EntityProperty__field--input input';
}

module.exports = {
  'Compose plugin: CRUD on details panel': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.expect.element('.Aside.disabled').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    // create Memory datasource
    page.addElementFromTooltip('dataSource', 'memory');
    browser.waitForElementPresent(getDataSourceSelector(1) + '.editable .submit', 5000);
    browser.pause(1000);
    browser.moveToElement(getDataSourceSelector(1) + '.editable .submit', 5, 5, function() {
      browser.click(getDataSourceSelector(1) + '.editable .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.pause(3000);

    // create REST datasource
    page.addElementFromTooltip('dataSource', 'rest');
    browser.waitForElementPresent(getDataSourceSelector(2) + '.editable .submit', 5000);
    page.setValueSlow(getDataSourceFieldSelector(1), 'dumpUrl');
    page.setValueSlow(getDataSourceFieldSelector(2), 'dumpDatabase');
    page.setValueSlow(getDataSourceFieldSelector(3), 'dumpUsername');
    page.setValueSlow(getDataSourceFieldSelector(4), 'dumpPassword');
    browser.pause(1000);
    browser.moveToElement(getDataSourceSelector(2) + '.editable .submit', 5, 5, function() {
      browser.click(getDataSourceSelector(2) + '.editable .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.pause(3000);

    // create Car model
    page.addElement('model');
    browser.waitForElementPresent(getModelSelector(1) + '.editable .submit', 5000);
    page.clearValue(getModelSelector(1) + '.editable .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.clearValue(getModelSelector(1) + '.editable .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + '.editable .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + '.editable .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + '.editable .EntityHeader .EntityProperty__field--input input', 'Car');
    browser.pause(1000);
    browser.moveToElement(getModelSelector(1) + '.editable .submit', 5, 5, function() {
      browser.click(getModelSelector(1) + '.editable .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.pause(3000);

    // create Driver model
    page.addElement('model');
    browser.waitForElementPresent(getModelSelector(2) + '.editable .submit', 5000);
    page.clearValue(getModelSelector(2) + '.editable .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.clearValue(getModelSelector(2) + '.editable .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + '.editable .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + '.editable .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + '.editable .EntityHeader .EntityProperty__field--input input', 'Driver');
    browser.pause(1000);
    browser.moveToElement(getModelSelector(2) + '.editable .submit', 5, 5, function() {
      browser.click(getModelSelector(2) + '.editable .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.pause(3000);

    // connect Memory with Car
    browser.click(getModelSelector(1));
    browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
    page.click('@details');
    browser.pause(2000);
    browser.waitForElementPresent('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select', 5000);
    browser.click('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select');
    browser.waitForElementPresent('.dataSource__Memory', 5000);
    browser.click('.dataSource__Memory');
    browser.pause(1000);
    browser.moveToElement('.DetailsPanel .confirm-button__button', 5, 5, function() {
      browser.click('.DetailsPanel .confirm-button__button');
    });
    browser.pause(2000);
    page.click('@details');
    browser.pause(2000);

    // check, if Memory-car connection is present
    browser.waitForElementPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
    browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

    // reload page and check if Memory, REST, Car, Driver and Memory-Car connection are present
    browser.refresh(function () {
      page.expect.element('.Aside.disabled').to.not.be.present;
      page.expect.element('.canvas__container--editing').to.not.be.present;
      browser.waitForElementPresent(getDataSourceSelector(1), 5000);
      browser.expect.element('.quadrant:first-child .Entity.DataSource:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Memory');
      browser.waitForElementPresent(getDataSourceSelector(2), 5000);
      browser.expect.element('.quadrant:first-child .Entity.DataSource:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('REST');
      browser.waitForElementPresent(getModelSelector(1), 5000);
      browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Car');
      browser.waitForElementPresent(getModelSelector(2), 5000);
      browser.expect.element('.quadrant:nth-child(2) .Entity.Model:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
      browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:first-child .port-out > .port__anchor--connected').to.be.present;
      browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .port-in > .port__anchor--connected').to.be.present;

      // rename Memory into Memory1
      browser.click(getDataSourceSelector(1));
      browser.waitForElementPresent(getDataSourceSelector(1) + '.highlighted', 5000);
      page.click('@details');
      browser.pause(2000);
      browser.waitForElementPresent('.DetailsPanel .panel__details--name input', 5000);
      page.clearValue('.DetailsPanel .panel__details--name input');
      browser.pause(1000);
      page.clearValue('.DetailsPanel .panel__details--name input');
      browser.pause(1000);
      page.setValueSlow('.DetailsPanel .panel__details--name input', '');
      browser.pause(1000);
      page.setValueSlow('.DetailsPanel .panel__details--name input', '');
      browser.pause(1000);
      page.setValueSlow('.DetailsPanel .panel__details--name input', 'Memory1');
      browser.pause(1000);
      browser.moveToElement('.DetailsPanel .confirm-button__button', 5, 5, function() {
        browser.click('.DetailsPanel .confirm-button__button');
      });
      browser.expect.element('.quadrant:first-child .Entity.DataSource:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');
      browser.pause(3000);

      // rename Car into Car1
      browser.click(getModelSelector(1));
      browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
      browser.pause(2000);
      browser.waitForElementPresent('.DetailsPanel .panel__details--name input', 5000);
      page.clearValue('.DetailsPanel .panel__details--name input');
      browser.pause(1000);
      page.clearValue('.DetailsPanel .panel__details--name input');
      browser.pause(1000);
      page.setValueSlow('.DetailsPanel .panel__details--name input', '');
      browser.pause(1000);
      page.setValueSlow('.DetailsPanel .panel__details--name input', '');
      browser.pause(1000);
      page.setValueSlow('.DetailsPanel .panel__details--name input', 'Car1');
      browser.pause(1000);
      browser.moveToElement('.DetailsPanel .confirm-button__button', 5, 5, function() {
        browser.click('.DetailsPanel .confirm-button__button');
      });
      browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
      browser.pause(3000);
      page.click('@details');
      browser.pause(2000);

      // check, if Memory1-Car1 connection is present
      browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:first-child .port-out > .port__anchor--connected').to.be.present;
      browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .port-in > .port__anchor--connected').to.be.present;

      // reload page and check if Memory1, REST, Car1, Driver and Memory1-Car1 connection are present
      browser.refresh(function () {
        page.expect.element('.Aside.disabled').to.not.be.present;
        page.expect.element('.canvas__container--editing').to.not.be.present;
        browser.waitForElementPresent(getDataSourceSelector(1), 5000);
        browser.expect.element('.quadrant:first-child .Entity.DataSource:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');
        browser.waitForElementPresent(getDataSourceSelector(2), 5000);
        browser.expect.element('.quadrant:first-child .Entity.DataSource:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('REST');
        browser.waitForElementPresent(getModelSelector(1), 5000);
        browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
        browser.waitForElementPresent(getModelSelector(2), 5000);
        browser.expect.element('.quadrant:nth-child(2) .Entity.Model:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
        browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:first-child .port-out > .port__anchor--connected').to.be.present;
        browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .port-in > .port__anchor--connected').to.be.present;

        // reattach connection from Memory1 to REST
        browser.click(getModelSelector(1));
        browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
        page.click('@details');
        browser.pause(2000);
        browser.waitForElementPresent('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select', 5000);
        browser.click('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select');
        browser.waitForElementPresent('.dataSource__REST', 5000);
        browser.click('.dataSource__REST');
        browser.pause(1000);
        browser.moveToElement('.DetailsPanel .confirm-button__button', 5, 5, function() {
          browser.click('.DetailsPanel .confirm-button__button');
        });
        browser.pause(2000);
        page.click('@details');
        browser.pause(2000);

        // check, if REST-Car1 connection is present
        browser.waitForElementNotPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

        // reload page and check if Memory1, REST, Car1, Driver and REST-Car1 connection are present
        browser.refresh(function () {
          page.expect.element('.Aside.disabled').to.not.be.present;
          page.expect.element('.canvas__container--editing').to.not.be.present;
          browser.waitForElementPresent(getDataSourceSelector(1), 5000);
          browser.expect.element('.quadrant:first-child .Entity.DataSource:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');
          browser.waitForElementPresent(getDataSourceSelector(2), 5000);
          browser.expect.element('.quadrant:first-child .Entity.DataSource:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('REST');
          browser.waitForElementPresent(getModelSelector(1), 5000);
          browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
          browser.waitForElementPresent(getModelSelector(2), 5000);
          browser.expect.element('.quadrant:nth-child(2) .Entity.Model:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
          browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:nth-child(2) .port-out > .port__anchor--connected').to.be.present;
          browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .port-in > .port__anchor--connected').to.be.present;

          // reattach connection from Car1 to Driver
          browser.click(getModelSelector(1));
          browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
          page.click('@details');
          browser.pause(2000);
          browser.waitForElementPresent('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select', 5000);
          browser.click('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select');
          browser.waitForElementPresent('.dataSource__None', 5000);
          browser.click('.dataSource__None');
          browser.pause(1000);
          browser.moveToElement('.DetailsPanel .confirm-button__button', 5, 5, function() {
            browser.click('.DetailsPanel .confirm-button__button');
          });
          browser.pause(2000);
          browser.click(getModelSelector(2));
          browser.waitForElementPresent(getModelSelector(2) + '.highlighted', 5000);
          browser.pause(2000);
          browser.waitForElementPresent('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select', 5000);
          browser.click('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select');
          browser.waitForElementPresent('.dataSource__REST', 5000);
          browser.click('.dataSource__REST');
          browser.pause(1000);
          browser.moveToElement('.DetailsPanel .confirm-button__button', 5, 5, function() {
            browser.click('.DetailsPanel .confirm-button__button');
          });
          browser.pause(2000);
          page.click('@details');
          browser.pause(2000);

          // check, if REST-Driver connection is present
          browser.waitForElementNotPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
          browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
          browser.waitForElementPresent(getModelSelector(2) + ' .port-in > .port__anchor--connected', 5000);

          // reload page and check if Memory1, REST, Car1, Driver and REST-Driver connection are present
          browser.refresh(function () {
            page.expect.element('.Aside.disabled').to.not.be.present;
            page.expect.element('.canvas__container--editing').to.not.be.present;
            browser.waitForElementPresent(getDataSourceSelector(1), 5000);
            browser.expect.element('.quadrant:first-child .Entity.DataSource:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');
            browser.waitForElementPresent(getDataSourceSelector(2), 5000);
            browser.expect.element('.quadrant:first-child .Entity.DataSource:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('REST');
            browser.waitForElementPresent(getModelSelector(1), 5000);
            browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
            browser.waitForElementPresent(getModelSelector(2), 5000);
            browser.expect.element('.quadrant:nth-child(2) .Entity.Model:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
            browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:first-child .port-out > .port__anchor--connected').to.not.be.present;
            browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .port-in > .port__anchor--connected').to.not.be.present;
            browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:nth-child(2) .port-out > .port__anchor--connected').to.be.present;
            browser.expect.element('.quadrant:nth-child(2) .Entity.Model:nth-child(2) .port-in > .port__anchor--connected').to.be.present;

            // remove Driver
            browser.click(getModelSelector(2));
            browser.waitForElementPresent(getModelSelector(2) + ' .Toolbox__button--delete', 5000);
            browser.click(getModelSelector(2) + ' .Toolbox__button--delete');
            browser.waitForElementPresent('.SystemDefcon1 .confirm', 5000);
            browser.click('.SystemDefcon1 .confirm');
            browser.waitForElementNotPresent(getModelSelector(2), 5000);
            browser.pause(3000);

            // check, if REST-Driver connection is also not present
            browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:nth-child(2) .port-out > .port__anchor--connected').to.not.be.present;

            // reload page and check if Memory1, REST, Car1 are present, and REST connection out is not present
            browser.refresh(function () {
              page.expect.element('.Aside.disabled').to.not.be.present;
              page.expect.element('.canvas__container--editing').to.not.be.present;
              browser.waitForElementPresent(getDataSourceSelector(1), 5000);
              browser.expect.element('.quadrant:first-child .Entity.DataSource:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');
              browser.waitForElementPresent(getDataSourceSelector(2), 5000);
              browser.expect.element('.quadrant:first-child .Entity.DataSource:nth-child(2) .EntityHeader .EntityProperty__field--text').text.to.equal('REST');
              browser.waitForElementPresent(getModelSelector(1), 5000);
              browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
              browser.waitForElementNotPresent(getModelSelector(2), 5000);
              browser.expect.element('.quadrant:nth-child(1) .Entity.DataSource:nth-child(2) .port-out > .port__anchor--connected').to.not.be.present;

              // connect REST with Car1
              browser.click(getModelSelector(1));
              browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
              page.click('@details');
              browser.pause(2000);
              browser.waitForElementPresent('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select', 5000);
              browser.click('.DetailsPanel .panel__details .EntityProperty:nth-child(4) .Select');
              browser.waitForElementPresent('.dataSource__REST', 5000);
              browser.click('.dataSource__REST');
              browser.pause(1000);
              browser.moveToElement('.DetailsPanel .confirm-button__button', 5, 5, function() {
                browser.click('.DetailsPanel .confirm-button__button');
              });
              page.click('@details');
              browser.pause(2000);

              // check, if REST-Car1 connection is present
              browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
              browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // remove REST
              browser.click(getDataSourceSelector(2));
              browser.waitForElementPresent(getDataSourceSelector(2) + ' .Toolbox__button--delete', 5000);
              browser.click(getDataSourceSelector(2) + ' .Toolbox__button--delete');
              browser.waitForElementPresent('.SystemDefcon1 .confirm', 5000);
              browser.click('.SystemDefcon1 .confirm');
              browser.waitForElementNotPresent(getDataSourceSelector(2), 5000);
              browser.pause(3000);

              // check, is Car1 connection in is also not present
              browser.expect.element('.quadrant:nth-child(2) .Entity.Model:nth-child(1) .port-in > .port__anchor--connected').to.not.be.present;

              // reload page and check, if Memory1 and Car1 are present, and Car1 connection in is not present
              browser.refresh(function () {
                page.expect.element('.Aside.disabled').to.not.be.present;
                page.expect.element('.canvas__container--editing').to.not.be.present;
                browser.waitForElementPresent(getDataSourceSelector(1), 5000);
                browser.expect.element('.quadrant:first-child .Entity.DataSource:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');
                browser.waitForElementNotPresent(getDataSourceSelector(2), 5000);
                browser.waitForElementPresent(getModelSelector(1), 5000);
                browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
                browser.waitForElementNotPresent(getModelSelector(2), 5000);
                browser.expect.element('.quadrant:nth-child(2) .Entity.Model:first-child .port-in > .port__anchor--connected').to.not.be.present;
              });
            });
          });
        });
      });
    });
  },

  after: function () {
    page.close();
  }
};
