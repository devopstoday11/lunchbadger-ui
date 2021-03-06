import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './ServiceEndpoint.scss';

const {
  components: {CanvasElement, Port},
  UI: {
    EntityProperty,
    EntitySubElements,
  },
} = LunchBadgerCore;

class ServiceEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static contextTypes = {
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {...this.stateFromStores(props)};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.onPropsUpdate(nextProps);
    }
  }

  stateFromStores = props => ({
    urls: props.entity.urls.slice(),
  });

  onPropsUpdate = (props = this.props, callback) =>
    this.setState({...this.stateFromStores(props)}, () => callback && callback());

  discardChanges = callback => this.onPropsUpdate(this.props, callback);

  processModel = model => this.props.entity.processModel(model);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  changeState = obj => this.setState(obj);

  handleUrlTab = idx => () => {
    const size = this.state.urls.length;
    if (size - 1 === idx) {
      this.addUrl();
    }
  };

  handleUrlChanged = idx => ({target: {value}}) => {
    const urls = _.cloneDeep(this.state.urls);
    urls[idx] = value;
    this.changeState({urls});
  };

  addUrl = () => {
    const urls = _.cloneDeep(this.state.urls);
    urls.push('');
    this.changeState({urls});
    setTimeout(() => {
      const idx = urls.length - 1;
      const input = document.getElementById(`urls[${idx}]`);
      input && input.focus();
    });
  }

  removeUrl = idx => () => {
    if (this.state.urls.length === 1) return;
    const urls = _.cloneDeep(this.state.urls);
    urls.splice(idx, 1);
    this.changeState({urls});
  }

  renderPorts() {
    const {entity} = this.props;
    return entity.ports.map((port, idx) => (
      <Port
        key={idx}
        way={port.portType}
        elementId={port.id}
        className={`port-${entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
        gaType={entity.gaType}
      />
    ));
  }

  renderUrls = () => {
    const {urls} = this.state;
    const {validations: {data}} = this.props;
    const canBeDeleted = urls.length > 1;
    return (
      <EntitySubElements
        title={`URL${urls.length === 1 ? '' : 'S'}`}
        onAdd={this.addUrl}
        main
      >
        {urls.map((url, idx) => (
          <EntityProperty
            key={idx}
            placeholder="Enter url here"
            name={`urls[${idx}]`}
            value={url}
            invalid={data[`urls[${idx}]`]}
            onDelete={canBeDeleted ? this.removeUrl(idx) : undefined}
            onTab={this.handleUrlTab(idx)}
            onBlur={this.handleUrlChanged(idx)}
          />
        ))}
      </EntitySubElements>
    );
  }

  render() {
    return (
      <div className="ServiceEndpoint">
        {this.renderPorts()}
        {this.renderUrls()}
      </div>
    );
  }
}

export default CanvasElement(ServiceEndpoint);
