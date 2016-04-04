import React, {Component} from 'react';
import './Tool.scss';
import AddDataSource from '../../actions/DataSource/add';

export default class Memory extends Component {
  render() {
    return (
      <div className="memory tool__context__item" onClick={() => AddDataSource()}>
      	<i className="tool__icon fa fa-database"/>
      	<span className="tool__name">Memory</span>
      </div>
    );
  }
}
