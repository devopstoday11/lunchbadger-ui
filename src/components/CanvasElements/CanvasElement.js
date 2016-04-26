import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import AppState from 'stores/AppState';
import toggleHighlight from 'actions/CanvasElements/toggleHighlight';
import panelKeys from 'constants/panelKeys';

const boxSource = {
  beginDrag(props) {
    const {entity, itemOrder} = props;
    return {entity, itemOrder};
  }
};

const boxTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().itemOrder;
    const hoverIndex = props.itemOrder;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveEntity(monitor.getItem().entity, dragIndex, hoverIndex);
    monitor.getItem().itemOrder = hoverIndex;
  }
};

@DragSource('canvasElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget('canvasElement', boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default (ComposedComponent) => {
  return class CanvasElement extends Component {
    static propTypes = {
      icon: PropTypes.string.isRequired,
      entity: PropTypes.object.isRequired,
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      itemOrder: PropTypes.number.isRequired,
      hideSourceOnDrag: PropTypes.bool.isRequired
    };

    constructor(props) {
      super(props);

      this.currentOpenedPanel = null;

      this.appStateUpdate = () => {
        const currentElement = AppState.getStateKey('currentElement');
        this.currentOpenedPanel = AppState.getStateKey('currentlyOpenedPanel');
        if (currentElement && currentElement.id === this.props.entity.id) {
          this.setState({highlighted: true});
          if (this.currentOpenedPanel === panelKeys.DETAILS_PANEL) {
            this.setState({editable: false});
          }
        } else {
          this.setState({highlighted: false});
        }

      };

      this.state = {
        name: props.entity.name,
        editable: true,
        expanded: true,
        highlighted: false
      };
    }

    componentWillReceiveProps(props) {
      this.setState({
        name: props.entity.name
      });
    }

    componentWillMount() {
      AppState.addChangeListener(this.appStateUpdate);
    }

    componentWillUnmount() {
      AppState.removeChangeListener(this.appStateUpdate);
    }

    componentDidMount() {
      if (this.props.entity.ready) {
        this.triggerElementAutofocus();
      }

      this.props.entity.elementDOM = this.elementDOM;
    }

    componentDidUpdate() {
      this.props.entity.elementDOM = this.elementDOM;
    }

    update() {
      const element = this.element.decoratedComponentInstance || this.element;

      if (typeof element.update === 'function') {
        element.update();
      }

      this.setState({
        editable: false,
        expanded: false
      });
    }

    updateName(evt) {
      const element = this.element.decoratedComponentInstance || this.element;

      this.setState({name: evt.target.value});

      if (typeof element.updateName === 'function') {
        element.updateName(evt);
      }
    }

    triggerElementAutofocus() {
      const nameInput = findDOMNode(this.refs.nameInput);
      const selectAllOnce = () => {
        nameInput.select();
        nameInput.removeEventListener('focus', selectAllOnce);
      };

      nameInput.addEventListener('focus', selectAllOnce);
      nameInput.focus();
    }

    handleEnterPress(event) {
      const keyCode = event.which || event.keyCode;

      // ENTER
      if (keyCode === 13) {
        this.update();
      }
    }

    toggleExpandedState() {
      this.setState({expanded: !this.state.expanded}, () => {
        this.props.paper.repaintEverything();
      });
    }

    toggleEditableState(event) {
      const {target} = event;

      if (this.state.editable) {
        return;
      }

      if (this.currentOpenedPanel !== panelKeys.DETAILS_PANEL) {
        this.setState({editable: true}, () => {
          this._focusClosestInput(target);
        });
      }
    }

    toggleHighlighted() {
      if (!this.state.highlighted) {
        toggleHighlight(this.props.entity);
      }
    }

    _focusClosestInput(target) {
      const closestProperty = target.closest('.canvas-element__properties__property');
      const closestPropertyInput = closestProperty && closestProperty.querySelector('input');
      const closestElement = target.closest('.canvas-element');
      const closestInput = closestElement.querySelector('input');

      if (closestPropertyInput) {
        return closestPropertyInput.focus();
      } else if (closestInput) {
        closestInput.focus();
      }
    }

    render() {
      const {ready} = this.props.entity;
      const elementClass = classNames({
        'canvas-element': true,
        editable: this.state.editable && ready,
        expanded: this.state.expanded && ready,
        collapsed: !this.state.expanded,
        highlighted: this.state.highlighted,
        wip: !ready
      });
      const {connectDragSource, connectDropTarget, isDragging} = this.props;
      const opacity = isDragging ? 0.2 : 1;

      return connectDragSource(connectDropTarget(
        <div ref={(ref) => this.elementDOM = ref}
             className={`${elementClass} ${this.props.entity.constructor.type}`}
             style={{ opacity }}
             onClick={(evt) => {this.toggleHighlighted(); evt.stopPropagation()}}
             onDoubleClick={this.toggleEditableState.bind(this)}>
          <div className="canvas-element__inside">
            <div className="canvas-element__icon" onClick={this.toggleExpandedState.bind(this)}>
              <i className={`fa ${this.props.icon}`}/>
            </div>
            <div className="canvas-element__title">
              <span className="canvas-element__name hide-while-edit">{this.props.entity.name}</span>
              <input className="canvas-element__input editable-only"
                     ref="nameInput"
                     value={this.state.name}
                     onKeyPress={this.handleEnterPress.bind(this)}
                     onChange={this.updateName.bind(this)}/>
            </div>
          </div>
          <div className="canvas-element__extra">
            <ComposedComponent parent={this} ref={(ref) => this.element = ref} {...this.props} {...this.state}/>
          </div>
          <div className="canvas-element__actions editable-only">
            <button className="canvas-element__button" onClick={() => this.update()}>OK</button>
          </div>
        </div>
      ));
    }
  }
}
