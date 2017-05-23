import React from 'react';
import {configure, addDecorator, setAddon} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import {setOptions} from '@kadira/storybook-addon-options';

setOptions({
  name: 'LunchBadger',
  url: 'https://app.lunchbadger.com',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false,
});

setAddon(infoAddon);

addDecorator((story) => (
  <div className="story">
    {story()}
  </div>
));

function loadStories() {
  require('../storybook/index.js');
}

configure(loadStories, module);