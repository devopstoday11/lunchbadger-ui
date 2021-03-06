import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {DragSource, DropTarget} from 'react-dnd';
import classNames from 'classnames';
import MetricHeader from './Subelements/MetricHeader';
import MetricRemoveButton from './Subelements/MetricRemoveButton';
import MetricDetails from './Subelements/MetricDetails';
import MetricTypeTooltip from './Subelements/MetricTypeTooltip';
import {aggregate} from '../../reduxActions/metrics';
import MetricFunctionDetails from './Subelements/MetricFunctionDetails';
import './Metric.scss';

const boxSource = {
  beginDrag(props) {
    const {metric} = props;
    return {metric, left: metric.left, top: metric.top};
  }
};

const boxTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();
    if (!item.metric) return false;
    if (item.metric.id === props.metric.id) return false;
    if (!props.metric.pairs) return false;
    if (props.metric.pairs.length > 1) return false;
    if (props.metric.pairs[0].metricTwo && !item.metric.pairs[0].metricTwo) return false;
    if (!item.metric.pairs) return false;
    if (item.metric.pairs.length > 1) return false;
    return true;
  },

  drop(props, monitor) {
    const item = monitor.getItem();
    const {metric, dispatch} = props;
    dispatch(aggregate(metric, item.metric));
  }
};

@DragSource('metric', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))

@DropTarget('metric', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))

class Metric extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired,
    isOver: PropTypes.bool,
    canDrop: PropTypes.bool,
    connectDragSource: PropTypes.func,
    connectDragPreview: PropTypes.func,
    connectDropTarget: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPairId: null
    };
  }

  _handleMetricSelection = (pair) => {
    this.setState({currentPairId: pair ? pair.id : null});
  }

  _handleMetricTypeChange = () => {
    this.setState({currentPairId: null});
  }

  renderHeader() {
    if (this.props.metric.constructor.type === 'MetricFunction') {
      const pair = {metricOne: {entity: {name: this.props.metric.name}}};
      return (
        <MetricHeader
          pair={pair}
        />
      );
    }
    return (
      <div>
        {
          this.props.metric.pairs.map((pair, index) => {
            return (
              <div key={pair.id}>
                {index > 0 && <div className="metric__title__details__split">AND</div>}
                <MetricHeader
                  selectedPair={this.state.currentPairId}
                  pair={pair}
                  metricSelection={this._handleMetricSelection}
                />
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    const {metric, connectDragSource, connectDragPreview, connectDropTarget} = this.props;
    const isFunction = metric.constructor.type === 'MetricFunction';
    const {left, top} = metric;
    const metricStyle = {
      left,
      top
    };
    const metricClass = classNames({
      metric: true,
      'metric--is-over': this.props.isOver && this.props.canDrop
    });
    const tooltipClass = classNames({
      metric__details__tooltip: true,
      'metric__details__tooltip--visible': this.state.currentPairId
    });
    return connectDropTarget(connectDragPreview(
      <div className={metricClass} style={metricStyle}>
        {connectDragSource(
          <div className="metric__title">
            <div className="metric__title__icon">
              <i className="icon-icon-metrics"/>
            </div>
            <div className="metric__title__details">
              {this.renderHeader()}
            </div>
            <MetricRemoveButton metric={this.props.metric}/>
          </div>
        )}
        {isFunction && (
          <MetricFunctionDetails id={metric.entityId} />
        )}
        {!isFunction && (
          <div className="metric__details">
            <div className={tooltipClass} onMouseLeave={() => this.setState({currentPairId: null})}>
              <MetricTypeTooltip
                pairId={this.state.currentPairId}
                metric={metric}
                onChange={this._handleMetricTypeChange}
              />
            </div>
            <MetricDetails metric={metric}/>
          </div>
        )}
      </div>
    ));
  }
}

export default connect(null)(Metric);
