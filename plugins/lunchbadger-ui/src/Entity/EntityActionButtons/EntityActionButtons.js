import React, {PropTypes} from 'react';
import {Button} from '../../';
import './EntityActionButtons.scss';

const EntityActionButtons = ({onCancel}) => (
  <div className="EntityActionButtons">
    <div className="EntityActionButtons__inner">
      <Button onClick={onCancel}>Cancel</Button>
      <Button type="submit">OK</Button>
    </div>
  </div>
);

EntityActionButtons.propTypes = {
  onCancel: PropTypes.func,
};

export default EntityActionButtons;