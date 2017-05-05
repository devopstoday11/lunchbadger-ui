import React, {Component} from 'react';
import cs from 'classnames';
import DeployPortal from '../../actions/CanvasElements/Portal/deploy';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Portal extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'Portal';
    return (
      <div className={cs('portal', 'tool', {['tool--selected']: isSelected})} onClick={() => DeployPortal('Portal')}>
        <IconSVG className="tool__svg" svg={entityIcons.Portal} />
        <span className="tool__tooltip">Portal</span>
      </div>
    );
  }
}

export default Tool(Portal);
