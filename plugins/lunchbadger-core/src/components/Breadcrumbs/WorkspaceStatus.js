/*eslint no-console:0 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import './WorkspaceStatus.scss';
import OneOptionModal from '../Generics/Modal/OneOptionModal';
import {ContextualInformationMessage} from '../../../../lunchbadger-ui/src';
import {showSystemDefcon1, toggleSystemNotifications} from '../../../../lunchbadger-ui/src/actions';


class WorkspaceStatus extends Component {
  static contextTypes = {
    projectService: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      connected: false,
      status: null,
      output: '',
      instance: null,
      visible: false,
      isShowingModal: false
    };
  }

  componentDidMount() {
    this.es = this.context.projectService.monitorStatus();
    this.es.addEventListener('data', this.onStatusReceived);
    this.es.addEventListener('open', this.onConnected);
    this.es.addEventListener('error', this.onDisconnected);
  }

  componentWillUnmount() {
    if (this.es) {
      this.es.close();
      this.es = null;
    }
  }

  onClick = () => {
    if (this.state.status === 'crashed') {
      this.props.showSystemNotifications();
    }
  }

  onEnter = () => {
    if (['running', 'installing'].includes(this.state.status)) {
      this.setState({visible: true});
    }
  }

  onLeave = () => {
    this.setState({visible: false});
  }

  onStatusReceived = (message) => {
    let status = JSON.parse(message.data).data;

    console.log('Status from server', status);

    if (this.state.instance && this.state.instance !== status.instance) {
      this.setState({
        isShowingModal: true
      });
    }

    this.setState({
      connected: true,
      status: status.status,
      output: status.output,
      instance: status.instance
    });

    if (status.status === 'crashed') {
      this.props.displaySystemDefcon1(status.output);
    }
  }

  onConnected = () => {
    this.setState({
      connected: true
    });
  }

  onDisconnected = () => {
    this.setState({
      connected: false
    });
  }

  onModalClose = () => {
    location.reload();
  }

  render() {
    let classes = ['fa'];
    let message = null;

    if (!this.state.connected) {
      message = 'Error connecting to server';
      classes.push(...['fa-question-circle', 'workspace-status__unknown'])
    } else if (this.state.status === 'running') {
      message = 'Workspace OK';
      classes.push(...['fa-check-circle', 'workspace-status__success']);
    } else if (this.state.status === 'crashed') {
      message = 'Workspace crashed';
      classes.push(...['fa-exclamation-triangle', 'workspace-status__failure']);
    } else if (this.state.status === 'installing') {
      message = 'Updating dependencies';
      classes.push('workspace-status__progress');
    }
    const {visible} = this.state;
    return (
      <span className="workspace-status">
        <span className={classnames(classes)}
          onClick={this.onClick}
          onMouseEnter={this.onEnter}
          onMouseLeave={this.onLeave}
        >
          {visible && (
            <ContextualInformationMessage>
              {message}
            </ContextualInformationMessage>
          )}
        </span>
        {
          this.state.isShowingModal &&
          <OneOptionModal confirmText="Reload"
                          onClose={this.onModalClose}>
            <p>
              The workspace has changed since the Canvas was loaded. Please
              reload the page to refresh the Canvas contents.
            </p>
          </OneOptionModal>
        }
      </span>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  displaySystemDefcon1: message => dispatch(showSystemDefcon1(message)),
  showSystemNotifications: () => dispatch(toggleSystemNotifications(true)),
});

export default connect(null, mapDispatchToProps)(WorkspaceStatus);
