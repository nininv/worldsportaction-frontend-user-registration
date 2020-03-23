import React, { Component } from 'react';
import "./swappable.css"
class Swappable extends Component {
  constructor() {
    super();

    this.state = {
      customFunc: null
    };
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev, customFunc = null) {
    ev.dataTransfer.setData('src', ev.target.id);
    // console.log(ev.target.parentNode, 'TARGET DRAGSTART');

    this.setState({
      initialParentNode: ev.target.parentNode
    });
  }

  dragEnd(ev, customFunc = null) {
    // console.log(ev.target.parentNode, 'TARGET DRAGEND');
    if (customFunc && ev.target.parentNode != this.state.initialParentNode) {
      console.log('custom func');
      this.props.customFunc();
    }
  }

  drop(ev, dragableId, dropzoneId, customFunc = null, swappable = true) {
    ev.preventDefault();
    let src = document.getElementById(ev.dataTransfer.getData('src'));
    let srcParent = src.parentNode;

    let target = document.getElementById(dragableId);
    let targetParent = target.parentNode;

    // console.log(src.parentNode.id, 'dragged element');
    // console.log(srcParent, 'parent of dragged');
    // console.log(target.parentNode.id, 'element to be swapped');

    swappable
      ? this.swapElements(src, target, srcParent, targetParent)
      : this.transferElement(src, dropzoneId);
  }

  swapElements(src, target, srcParent, targetParent) {
    target.replaceWith(src);
    srcParent.appendChild(target);
    this.props.onSwap(src.id, target.id);
    // console.log(src.id, 'source');
    // console.log(target.id, 'target');
  }

  transferElement(src, dropzoneId) {
    let dropzone = document.getElementById(dropzoneId);
    dropzone.appendChild(src);
  }

  render() {
    const dropZoneStyle = {
      width: '50px',
      minHeight: '50px',
      //   padding: '10px',
      border: '1px solid #aaaaaa'
    };

    const draggableStyle = {
      width: '50px',
      height: '50px',
      //   padding: '10px',
      border: '1px solid red'
    };

    const { id, content, swappable, customFunc } = this.props;
    const dropzoneId = 'drop' + id;
    // const dragableId = 'drag' + id;
    const dragableId = id;
    return (
      <div
        id={dropzoneId}
        onDrop={event =>
          this.drop(event, dragableId, dropzoneId, customFunc, swappable)
        }
        onDragOver={event => this.allowDrop(event)}
        className="dropzoneId"
      >
        <div
          id={dragableId}
          draggable="true"
          onDragStart={event => this.drag(event)}
          onDragEnd={event => this.dragEnd(event, customFunc)}
          className="dragableId"
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Swappable;
