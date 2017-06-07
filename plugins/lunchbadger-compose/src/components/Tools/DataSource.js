import React from 'react';
import PropTypes from 'prop-types';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {entityIcons, dataSourceIcons, Tool} from '../../../../lunchbadger-ui/src';

const dataSources = [
  'Memory',
  'REST',
  'SOAP',
  'MongoDB',
  'Redis',
  'MySQL',
  'Ethereum',
  'Salesforce',
];

const dataSourcesWizard = [
  'MongoDB',
  'Redis',
  'MySQL',
];

const getDataSourceType = label => label === 'Ethereum' ? 'web3' : label;

const wizardFunc = (label) => () => {
  //TODO: implement datasource wizard
};

const getWizardFunc = label => dataSourcesWizard.includes(label) ? wizardFunc(label) : undefined;

const DataSource = ({editedElement}) => {
  const selected = dataSources.includes(editedElement);
  const submenu = [];
  dataSources.forEach((label) => {
    submenu.push({
      label,
      icon: dataSourceIcons[label],
      onClick: () => AddDataSource(label, getDataSourceType(label)),
      wizard: getWizardFunc(label),
      tooltip: 'Connect to an existing data source',
      wizardTooltip: 'Create and connect to a new data source',
    });
  })
  return (
    <Tool
      icon={entityIcons.DataSource}
      selected={selected}
      submenu={submenu}
      tooltip="Data Source"
    />
  );
}

DataSource.propTypes = {
  editedElement: PropTypes.string,
};

export default DataSource;
