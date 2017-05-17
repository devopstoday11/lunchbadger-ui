import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class QuadrantContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    paper: PropTypes.object,
    canvasHeight: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  };

  constructor(props) {
    super(props);

    this.onWindowResize = () => {
      this.forceUpdate();
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener(this.onWindowResize);
  }

  renderQuadrants() {
    const pluggedQuadrants = this.props.plugins.getQuadrants();
    const initialPercentageWidth = 100 / pluggedQuadrants.length;

    return pluggedQuadrants.map((plugin, index) => {
      const QuadrantComponent = plugin.component;

      return (
        <QuadrantComponent key={`plugged-quadrant-${index}-${plugin.title}`}
                           appState={this.props.appState}
                           paper={this.props.paper}
                           data={plugin.dataStore}
                           resizable
                           initialPercentageWidth={initialPercentageWidth}
                           title={plugin.title}/>
      );
    });
  }

  render() {
    const containerClass = classNames({
      'canvas__container--editing': this.props.appState.getStateKey('currentEditElement')
    });

    return (
      <div style={{minHeight: this.props.canvasHeight}} className={`${this.props.className} ${containerClass}`} id={this.props.id}>
        {this.renderQuadrants()}
      </div>
    );
  }
}
