import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {entityIcons, IconSVG, EntityProperty} from '../../';
import './EntityHeader.scss';

class EntityHeader extends Component {
  getInputNameRef = () => this.inputNameRef.getInputRef();

  render() {
    const {type, name, onNameChange, onToggleExpand} = this.props;
    const underlineStyle = {
      borderColor: '#8dbde2',
    }
    const underlineFocusStyle = {
      borderColor: '#FFF',
    }
    return (
      <div className="EntityHeader">
        <div className="EntityHeader__icon" onClick={onToggleExpand}>
          <IconSVG svg={entityIcons[type]}/>
        </div>
        <div className="EntityHeader__name">
          <EntityProperty
            ref={(r) => {this.inputNameRef = r;}}
            name="name"
            value={name}
            onChange={onNameChange}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
          />
        </div>
      </div>
    );
  }
}

EntityHeader.propTypes = {
  type: PropTypes.string.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default EntityHeader;
