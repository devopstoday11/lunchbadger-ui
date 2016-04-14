import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updateModel from '../../actions/Model/update';
import classNames from 'classnames';

class Model extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  onNameUpdate(name) {
    updateModel(this.props.entity.id, {name});
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      const portClass = classNames({
        'canvas-element__port--out': port.portType === 'out',
        'canvas-element__port--in': port.portType === 'in',
        'canvas-element__port': true
      });

      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              scope={port.portGroup}
              className={portClass}/>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderPorts()}
      </div>
    );
  }
}

export default CanvasElement(Model);
