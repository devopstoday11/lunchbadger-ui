import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import unbundlePortal from '../../actions/CanvasElements/Portal/unbundle';
import moveBetweenPortals from '../../actions/CanvasElements/Portal/rebundle';
import classNames from 'classnames';
import bundlePortal from '../../actions/CanvasElements/Portal/bundle';
import {addSystemInformationMessage} from '../../../../lunchbadger-ui/src/actions';
import {toggleEdit} from '../../../../lunchbadger-core/src/reduxActions';
import _ from 'lodash';
import './API.scss';
import API from './Subelements/API';

const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;

class Portal extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.previousConnection = null;

    this.state = {
      hasConnection: null,
      isShowingModal: false,
      isShowingModalMultiple: false,
      bundledItem: null,
      bundledItems: [],
      APIsOpened: {},
    }
  }

  componentDidMount() {
    const {paper, ready, toggleEdit, entity} = this.props;
    // paper.bind('connectionDetached', (info) => {
    //   this.previousConnection = info;
    // });
    // if (!ready) {
    //   toggleEdit(entity);
    // }
    const APIsOpened = {...this.state.APIsOpened};
    entity.apis.forEach((item) => {
      APIsOpened[item.id] = true;
    });
    this.setState({APIsOpened});
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.ready && !this.props.ready) {
      this._onDeploy();
    }
    // if (nextState === null || this.state.hasConnection !== nextState.hasConnection) {
    //   const hasConnection = nextProps.entity.publicEndpoints.some((publicEndpoint) => {
    //     return Connection.getConnectionsForTarget(publicEndpoint.id).length;
    //   });
    //   if (hasConnection) {
    //     this.setState({hasConnection: true});
    //   } else {
    //     this.setState({hasConnection: false});
    //   }
    // }
    const APIsOpened = {...this.state.APIsOpened};
    let isChange = false;
    nextProps.entity.apis.forEach((item) => {
      if (typeof APIsOpened[item.id] === 'undefined') {
        APIsOpened[item.id] = true;
        isChange = true;
      }
    });
    if (isChange) {
      this.setState({APIsOpened});
    }
  }

  _onDeploy() {
    const dispatchRedux = LunchBadgerCore.dispatchRedux;
    dispatchRedux(addSystemInformationMessage({
      message: 'Portal successfully deployed',
      type: 'success'
    }));
    this.props.parent.triggerElementAutofocus();
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  handleToggleAPIOpen = APIId => opened => {
    this.setState({APIsOpened: {...this.state.APIsOpened, [APIId]: opened}});
  }

  renderAPIs() {
    const APIsPublicEndpoints = {};
    this.props.entity.apis.forEach((endpoint) => {
      APIsPublicEndpoints[endpoint.id] = endpoint.publicEndpoints.length;
    });
    return this.props.entity.apis.map((endpoint, index) => {
      return (
        <API
          key={endpoint.id}
          {...this.props}
          parent={this.props.entity}
          key={endpoint.id}
          id={endpoint.id}
          entity={endpoint}
          paper={this.props.paper}
          left={endpoint.left || 0}
          top={endpoint.top || 0}
          handleEndDrag={(item) => this._handleEndDrag(item)}
          hideSourceOnDrag={true}
          onToggleOpen={this.handleToggleAPIOpen(endpoint.id)}
          APIsOpened={this.state.APIsOpened}
          index={index}
          APIsPublicEndpoints={APIsPublicEndpoints}
        />
      );
    });
  }

  _handleModalConfirm = () => {
    const item = this.state.bundledItem;
    unbundlePortal(item.parent, item.entity);
  }

  _handleClose = () => {
    this.setState({
      isShowingModal: false,
      isShowingModalMultiple: false
    });
  }

  _handleEndDrag(item) {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item
      });
    }
  }

  _handleMultipleUnbundle() {
    this.setState({
      isShowingModalMultiple: true,
      bundledItems: this.props.currentlySelectedSubelements,
    });
  }

  _handleModalConfirmMultiple = () => {
    this.state.bundledItems.forEach(item => unbundlePortal(this.props.entity, item));
  }

  render() {
    const elementClass = classNames({
      'has-connection': this.state.hasConnection
    });
    const {validations: {data}, entityDevelopment, onResetField} = this.props;
    const mainProperties = [
      {
        name: 'rootUrl',
        title: 'root URL',
        value: this.props.entity.rootUrl,
        invalid: data.rootUrl,
        onBlur: this.handleFieldChange('rootUrl'),
      },
    ];
    mainProperties.forEach((item, idx) => {
      mainProperties[idx].isDelta = item.value !== entityDevelopment[item.name];
      mainProperties[idx].onResetField = onResetField;
    });
    return (
      <div className={elementClass}>
        <EntityProperties properties={mainProperties} />
        <EntitySubElements title="APIs" main>
          <DraggableGroup
            iconClass="icon-icon-portal"
            entity={this.props.entity}
            groupEndDrag={() => this._handleMultipleUnbundle()}
          >
            {this.renderAPIs()}
          </DraggableGroup>
        </EntitySubElements>
        <div className="canvas-element__drop">
          <ElementsBundler
            {...this.props}
            canDropCheck={
              (item) => _.includes(this.props.entity.accept, item.entity.metadata.type)
              && !_.includes(this.props.entity.apis, item.entity)
            }
            onAddCheck={(item) => !_.includes(this.props.entity.apis, item.entity)}
            onAdd={bundlePortal}
            onMove={moveBetweenPortals}
            dropText={'Drag APIs here'}
            parent={this.props.parent}
            entity={this.props.entity}
          />
        </div>
        {this.state.isShowingModal && (
          <TwoOptionModal
            title="Unbundle Portal"
            confirmText="Yes"
            discardText="No"
            onClose={this._handleClose}
            onSave={this._handleModalConfirm}
          >
            <span>
              Are you sure you want to unbundle
              "{this.state.bundledItem.entity.name}"
              from
              "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        )}
        {this.state.isShowingModalMultiple && (
          <TwoOptionModal
            title="Unbundle Portal"
            confirmText="Yes"
            discardText="No"
            onClose={this._handleClose}
            onSave={this._handleModalConfirmMultiple}
          >
            <span>
              Are you sure you want to unbundle
              "{this.state.bundledItems.map(entity => entity.name).join(', ')}"
              from
              "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentlySelectedSubelements: state.core.appState.currentlySelectedSubelements,
});

const mapDispatchToProps = dispatch => ({
  toggleEdit: element => dispatch(toggleEdit(element)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasElement(Portal));
