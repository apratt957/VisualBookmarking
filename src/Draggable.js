import React from "react";
import ReactDOM from "react-dom";

class Draggable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relX: props.relX ? props.relX : 0,
      relY: props.relY ? props.relY : 0,
      x: props.x,
      y: props.y,
    };
    this.gridX = props.gridX || 1;
    this.gridY = props.gridY || 1;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  onStart(e) {
    const ref = ReactDOM.findDOMNode(this.handle);
    const body = document.body;
    const box = ref.getBoundingClientRect();
    this.setState({
      relX: e.pageX - (box.left + body.scrollLeft - body.clientLeft),
      relY: e.pageY - (box.top + body.scrollTop - body.clientTop),
    });
  }

  onMove(e) {
    const x = Math.trunc((e.pageX - this.state.relX) / this.gridX) * this.gridX;
    const y = Math.trunc((e.pageY - this.state.relY) / this.gridY) * this.gridY;
    if (x !== this.state.x || y !== this.state.y) {
      this.setState({
        x,
        y,
      });
      this.props.onMove && this.props.onMove(this.state.x, this.state.y);
    }
  }

  onMouseDown(e) {
    if (e.button !== 0) return;
    this.onStart(e);
    const ref = ReactDOM.findDOMNode(this.handle);
    const box = ref.getBoundingClientRect();

    //this checks if the mouse is on the bottom right corner of the div
    //and if it is it returns early so that the user can't drag the div
    //from there and instead can properly use the css resize
    if (e.clientX > box.right - 40 && e.clientY > box.left - 40) {
      return;
    } else {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    }
    e.preventDefault();
  }

  onMouseUp(e) {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    this.props.onStop && this.props.onStop(this.state.x, this.state.y);
    e.preventDefault();
  }

  onMouseMove(e) {
    this.onMove(e);
    e.preventDefault();
  }

  onTouchStart(e) {
    this.onStart(e.touches[0]);
    document.addEventListener("touchmove", this.onTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.onTouchEnd, { passive: false });
    e.preventDefault();
  }

  onTouchMove(e) {
    this.onMove(e.touches[0]);
    e.preventDefault();
  }

  onTouchEnd(e) {
    document.removeEventListener("touchmove", this.onTouchMove);
    document.removeEventListener("touchend", this.onTouchEnd);
    this.props.onStop && this.props.onStop(this.state.x, this.state.y);
    e.preventDefault();
  }

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
        style={{
          resize: "both",
          overflow: "hidden",
          height: "150px",
          width: "150px",
          position: "absolute",
          left: this.state.x,
          top: this.state.y,
          touchAction: "none",
        }}
        ref={(div) => {
          this.handle = div;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Draggable;
