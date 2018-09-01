import React, {Component} from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Provider} from 'mobx-react';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import HeaderMultiEnv from '../Header/HeaderMultiEnv';
import Spinner from './Spinner';
import PanelContainer from '../Panel/PanelContainer';
import DetailsPanel from '../Panel/DetailsPanel';
import {loadFromServer} from '../../reduxActions';
import {
  Aside,
  SystemInformationMessages,
  SystemNotifications,
  SystemDefcon1,
  Walkthrough,
} from '../../../../lunchbadger-ui/src';
import {getUser} from '../../utils/auth';
import userStorage from '../../utils/userStorage';
import Config from '../../../../../src/config';
import Connections from '../../stores/Connections';
import './App.scss';

@DragDropContext(HTML5Backend)
class App extends Component {
  static childContextTypes = {
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
    paper: PropTypes.object,
  }

  static propTypes = {
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
    paper: PropTypes.object,
    blocked: PropTypes.bool,
  }

  getChildContext() {
    const {multiEnvIndex, multiEnvDelta, multiEnvAmount, paper} = this.props;
    return {
      multiEnvIndex,
      multiEnvDelta,
      multiEnvAmount,
      paper,
    };
  }

  componentWillMount() {
    this.props.dispatch(loadFromServer());
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleBeforeUnload = (event) => {
    if (this.props.pendingEdit) {
      const message = 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?';
      (event || window.event).returnValue = message;
      return message;
    }
  };

  renderHeader = () => {
    const {isEntityEditable} = this.props;
    const username = getUser().profile.preferred_username;
    if (LunchBadgerCore.isMultiEnv) {
      return (
        <HeaderMultiEnv
          username={username}
          disabledMultiEnvMenu={isEntityEditable || !!this.props.currentlyOpenedPanel}
          headerMenuDisabled={isEntityEditable}
        />
      );
    }
    return (
      <Header
        username={username}
        envId={Config.get('envId')}
      />
    );
  }

  render() {
    const {
      systemDefcon1Visible,
      systemDefcon1Errors,
      multiEnvDelta,
      multiEnvIndex,
      currentlyOpenedPanel,
      isEntityEditable,
      walkthrough,
      blocked,
    } = this.props;
    const {isMultiEnv} = LunchBadgerCore;
    const multiEnvDeltaStyle = {
      // filter: multiEnvDelta ? 'grayscale(100%) opacity(70%)' : undefined,
    }
    const multiEnvNotDev = multiEnvIndex > 0;
    const walkthroughSteps = Object.keys(walkthrough)
      .sort()
      .map(key => {
        if (!walkthrough[key].selector) {
          walkthrough[key].selector = 'body';
        }
        return walkthrough[key];
      });
    const userId = getUser().profile.sub;
    return (
      <Provider connectionsStore={Connections}>
        <div className={cs('app__wrapper', {blocked})}>
          <div className={cs('apla', {['multiEnv']: isMultiEnv, multiEnvDelta})} />
          <div className={cs('app', {['multiEnv']: isMultiEnv, multiEnvDelta, multiEnvNotDev})}>
            <Spinner />
            {this.renderHeader()}
            <Aside
              disabled={multiEnvNotDev || !!currentlyOpenedPanel || isEntityEditable}
            />
            <div className="app__container">
              <div className="app__panel-wrapper">
                <SystemNotifications />
                <div style={multiEnvDeltaStyle}>
                  <PanelContainer />
                </div>
              </div>
              <div style={multiEnvDeltaStyle}>
                <Canvas multiEnvDelta={multiEnvDelta} />
              </div>
            </div>
            <SystemInformationMessages />
            {systemDefcon1Visible && (
              <SystemDefcon1 errors={systemDefcon1Errors} />
            )}
          </div>
          <DetailsPanel />
          <Walkthrough
            steps={walkthroughSteps}
            userId={userId}
          />
        </div>
      </Provider>
    );
  }
}

const selector = createSelector(
  state => state.systemDefcon1.visible,
  state => state.systemDefcon1.errors,
  state => state.multiEnvironments.selected,
  state => state.multiEnvironments.environments[state.multiEnvironments.selected].delta,
  state => state.multiEnvironments.environments.length,
  state => state.states.currentlyOpenedPanel,
  state => !!state.states.currentEditElement,
  state => state.plugins.walkthrough,
  state => !!state.states.zoom,
  (
    systemDefcon1Visible,
    systemDefcon1Errors,
    multiEnvIndex,
    multiEnvDelta,
    multiEnvAmount,
    currentlyOpenedPanel,
    isEntityEditable,
    walkthrough,
    isZoomWindowOpened,
  ) => ({
    systemDefcon1Visible,
    systemDefcon1Errors,
    multiEnvIndex,
    multiEnvDelta,
    multiEnvAmount,
    currentlyOpenedPanel,
    isEntityEditable,
    walkthrough,
    pendingEdit: isEntityEditable || isZoomWindowOpened,
  }),
);

export default connect(selector)(App);
