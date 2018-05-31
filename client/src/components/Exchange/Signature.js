import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';

const SIGNATURE_PATH =
  'm 237.96094,0 c 0,0 -77.52969,77.665619 -116.29492,116.49805 L 47.626953,42.587891 0,90.296875 121.61914,211.84375 238.04492,95.214844 354.67188,211.64062 l 47.5664,-47.65039 z';
const SIGNATURE_IMAGE_URL = '/assets/signature.svg';
const SIGNATURE_PLACEHOLDER_COLOR = '#ededed';
const SIGNATURE_INITIAL_PROGRESS = 0.115;
const SIGNATURE_SUFFICIENT_PROGRESS = 0.885;
const SIGNATURE_COMPLETION_DELAY = 1000;

const States = {
  INITIAL: 0,
  SIGNING: 1,
  SIGNED: 2
};

class Signature extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {imageLoaded: false, status: States.INITIAL};
    this.path = new Path2D(SIGNATURE_PATH);
    this.image = new Image();
    this.image.src = SIGNATURE_IMAGE_URL;
    this.image.onload = this.onImageLoaded;
  }

  onRefChanged(canvas) {
    this.canvas = canvas || null;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    if (canvas) {
      this.ctx.fillStyle = SIGNATURE_PLACEHOLDER_COLOR;
      this.drawSignature({progress: SIGNATURE_INITIAL_PROGRESS});
      canvas.addEventListener('mousedown', this.handleMouseDown);
      canvas.addEventListener('mousemove', this.handleMouseMove);
      canvas.addEventListener('mouseup', this.handleMouseUp);
      canvas.addEventListener('touchstart', this.handleTouchStart);
      canvas.addEventListener('touchmove', this.handleTouchMove);
      canvas.addEventListener('touchend', this.handleTouchEnd);
    }
  }

  onImageLoaded() {
    this.setState({
      imageLoaded: true
    });
  }

  drawSignature({progress, width}) {
    const {ctx, path, image} = this;
    const {height} = image;
    const drawingWidth = width || image.width * progress;
    ctx.clearRect(0, 0, image.width, height);
    ctx.fill(path);
    ctx.drawImage(image, 0, 0, drawingWidth, height, 0, 0, drawingWidth, height);
  }

  handleMouseDown(e) {
    const {status} = this.state;
    const {canvas} = this;
    if (status === States.SIGNED) return;

    const pos = this.getMousePos(e);
    const isSigning = pos.x < canvas.width * SIGNATURE_INITIAL_PROGRESS && this.isMouseInBounds(e);
    this.setState({status: isSigning ? States.SIGNING : States.INITIAL});
  }

  handleMouseMove(e) {
    const {canvas, image} = this;
    const {status} = this.state;

    if (!canvas || status === States.SIGNED) return false;

    const pos = this.getMousePos(e);
    if (status === States.SIGNING) {
      const isInBounds = this.isMouseInBounds(e);
      if (isInBounds) {
        if (pos.x >= image.width * SIGNATURE_SUFFICIENT_PROGRESS) {
          this.drawSignature({progress: 1});
          this.setState({status: States.SIGNED});
          setTimeout(this.props.onSigned, SIGNATURE_COMPLETION_DELAY);
        } else {
          this.drawSignature({width: pos.x});
        }
      } else {
        this.drawSignature({progress: SIGNATURE_INITIAL_PROGRESS});
        this.setState({status: States.INITIAL});
      }
      return isInBounds;
    }

    return false;
  }

  handleMouseUp() {
    if (this.state.status === States.SIGNING) {
      this.setState({status: States.INITIAL});
      this.drawSignature({progress: SIGNATURE_INITIAL_PROGRESS});
    }
  }

  handleTouchStart(e) {
    this.handleMouseDown(e.changedTouches[0]);
  }

  handleTouchMove(e) {
    if (this.handleMouseMove(e.changedTouches[0])) {
      e.preventDefault();
    }
  }

  handleTouchEnd() {
    this.handleMouseUp();
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  isMouseInBounds(e) {
    const {ctx, path} = this;
    const pos = this.getMousePos(e);

    return ctx.isPointInPath(path, pos.x, pos.y);
  }

  render() {
    return this.state.imageLoaded ? (
      <canvas width={this.image.width} height={this.image.height} ref={this.onRefChanged} />
    ) : null;
  }
}

Signature.propTypes = {
  onSigned: PropTypes.func.isRequired
};

export default Signature;
