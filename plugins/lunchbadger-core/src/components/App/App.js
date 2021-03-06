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
import OneOptionModal from '../Generics/Modal/OneOptionModal';
import {
  loadFromServer,
  setSilentReloadAlertVisible,
} from '../../reduxActions';
import {
  SystemInformationMessages,
  SystemDefcon1,
  Aside,
  Walkthrough,
} from '../../ui';
import userStorage from '../../utils/userStorage';
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

  handleCloseSilentReloadAlert = () => this.props.dispatch(setSilentReloadAlertVisible(false));

  renderHeader = () => {
    const {isEntityEditable} = this.props;
    const activeUsername = userStorage.getActiveUsername();
    const activeProject = userStorage.getActiveProject();
    if (LunchBadgerCore.isMultiEnv) {
      return (
        <HeaderMultiEnv
          username={activeUsername}
          disabledMultiEnvMenu={isEntityEditable || !!this.props.currentlyOpenedPanel}
          headerMenuDisabled={isEntityEditable}
        />
      );
    }
    return (
      <Header
        username={activeUsername}
        projectName={activeProject}
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
      isSilentReloadAlertVisible,
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
    const userId = userStorage.getActiveUsername();
    return (
      <Provider connectionsStore={Connections}>
        <div className={cs('app__wrapper')}>
          <div className={cs('apla', {['multiEnv']: isMultiEnv, multiEnvDelta})} />
          <div className={cs('app', {['multiEnv']: isMultiEnv, multiEnvDelta, multiEnvNotDev})}>
            <Spinner force={blocked} />
            {this.renderHeader()}
            <Aside
              disabled={multiEnvNotDev || !!currentlyOpenedPanel || isEntityEditable}
            />
            <div className="app__container">
              <div className="app__panel-wrapper">
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
          {isSilentReloadAlertVisible && (
            <OneOptionModal
              confirmText="Got it"
              onClose={this.handleCloseSilentReloadAlert}
            >
              The Entity you were editing was unlocked
              <br />
              or changed on another session.
            </OneOptionModal>
          )}
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
  state => !!state.states.silentReloadAlertVisible,
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
    isSilentReloadAlertVisible,
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
    isSilentReloadAlertVisible,
  }),
);

export default connect(selector)(App);
