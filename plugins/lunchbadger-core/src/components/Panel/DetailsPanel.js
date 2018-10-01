import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import cs from 'classnames';
import {setCurrentZoom, clearCurrentElement} from '../../reduxActions';
import {actions} from '../../reduxActions/actions';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {RnD, GAEvent} from '../../../../lunchbadger-ui/src';
import userStorage from '../../utils/userStorage';
import './DetailsPanel.scss';

@inject('connectionsStore') @observer
class DetailsPanel extends Component {
  static type = 'DetailsPanel';

  constructor(props) {
    super(props);
    this.state = {
      showRemovingModal: false,
    };
  }

  handleTabChange = tab => () => {
    const {dispatch, zoom, currentElement} = this.props;
    dispatch(setCurrentZoom({...zoom, tab}));
    const gaLabel = `${currentElement.gaType}: ${zoom.tab} => ${tab}`;
    GAEvent('Zoom Window', 'Switched Tab', gaLabel);
  };

  handleRemove = () => {
    const {currentElement, dispatch} = this.props;
    let baseDetails = this.element;
    if (this.element.getWrappedInstance) {
      baseDetails = this.element.getWrappedInstance();
    }
    if (baseDetails) {
      const element = baseDetails.getElementRef();
      if (element && typeof element.onRemove === 'function') {
        element.onRemove();
      }
    }
    userStorage.removeObjectKey('FilesEditorSize', currentElement.id);
    userStorage.removeObjectKey('ResizableWrapperSize', currentElement.id);
    dispatch(currentElement.remove());
    dispatch(actions.removeEntity(currentElement));
    dispatch(setCurrentZoom(undefined));
    dispatch(clearCurrentElement());
    GAEvent('Zoom Window', 'Removed Entity', currentElement.gaType);
  };

  renderDetails() {
    const {currentElement, panels, connectionsStore, zoom} = this.props;
    if (currentElement) {
      const {type} = currentElement.constructor;
      const DetailsPanelComponent = panels[type];
      if (DetailsPanelComponent) {
        return (
          <div className="panel panel__body details highlighted editable">
            <DetailsPanelComponent
              ref={(ref) => this.element = ref}
              entity={currentElement}
              sourceConnections={connectionsStore.getConnectionsForTarget(currentElement.id)}
              targetConnections={connectionsStore.getConnectionsForSource(currentElement.id)}
              rect={zoom}
            />
          </div>
        );
      }
    }
  }

  renderDnD = () => {
    const {zoom, currentElement, dispatch} = this.props;
    if (!(zoom && currentElement)) return <div />;
    const {tab} = zoom;
    const {name, id, gaType} = currentElement;
    const {type} = currentElement.constructor;
    const tabs = currentElement.tabs || [];
    const toolboxActions = currentElement.toolboxActions || [];
    const toolboxConfig = [{
      action: 'delete',
      icon: 'iconTrash',
      onClick: () => this.setState({showRemovingModal: true}),
      label: 'Remove',
    }];
    toolboxActions.forEach(({name, icon, label, onClick}) => {
      toolboxConfig.push({
        action: name,
        icon,
        onClick: () => dispatch(onClick(currentElement)),
        label,
      });
    });
    if (tabs.length > 0) {
      toolboxConfig.push({
        action: 'zoom',
        icon: 'iconBasics',
        onClick: this.handleTabChange('general'),
        selected: tab === 'general',
        label: 'Details',
      });
      tabs.map(({name, icon, label}) => toolboxConfig.push({
        action: name,
        icon,
        onClick: this.handleTabChange(name),
        selected: tab === name,
        label,
      }));
    }
    return (
      <RnD
        rect={zoom}
        name={name}
        type={type}
        toolbox={toolboxConfig}
        entityId={id}
        gaType={gaType}
      >
        {this.renderDetails()}
      </RnD>
    );
  };

  render() {
    const {zoom, currentElement} = this.props;
    const visible = !!currentElement && !!zoom && !zoom.close;
    return (
      <div className={cs('DetailsPanel', {visible})}>
        {this.renderDnD()}
        {this.state.showRemovingModal && (
          <TwoOptionModal
            onClose={() => this.setState({showRemovingModal: false})}
            onSave={this.handleRemove}
            onCancel={() => this.setState({showRemovingModal: false})}
            title="Remove entity"
            confirmText="Remove"
            discardText="Cancel"
          >
            <span>
              Do you really want to remove that entity?
            </span>
          </TwoOptionModal>
        )}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentElement,
  state => state.plugins.panelDetailsElements,
  state => state.states.zoom,
  state => state.entities,
  (
    currElement,
    panels,
    zoom,
    entities,
  ) => {
    let currentElement = null;
    if (currElement) {
      currentElement = entities[currElement.type][currElement.id] || null;
    }
    return {
      currentElement,
      panels,
      zoom,
    };
  },
);

export default connect(selector)(DetailsPanel);
