import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';

const SIGNATURE_PATH =
  'm 237.96094,0 c 0,0 -77.52969,77.665619 -116.29492,116.49805 L 47.626953,42.587891 0,90.296875 121.61914,211.84375 238.04492,95.214844 354.67188,211.64062 l 47.5664,-47.65039 z';
const SIGNATURE_START_PATH =
  'M 33.177734 123.41602 L 80.845703 75.748047 L 47.626953 42.587891 L 0 90.296875 L 33.177734 123.41602 z ';
const SIGNATURE_FINISH_PATH =
  'M 369.23242 131.04102 L 321.62305 178.65039 L 354.67188 211.64062 L 402.23828 163.99023 L 369.23242 131.04102 z';
const SIGNATURE_IMAGE_URL = '/assets/signature.svg';
const SIGNATURE_PLACEHOLDER_COLOR = '#ededed';
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
    this.startPath = new Path2D(SIGNATURE_START_PATH);
    this.finishPath = new Path2D(SIGNATURE_FINISH_PATH);
    this.image = new Image();
    this.image.src = SIGNATURE_IMAGE_URL;
    this.image.onload = this.onImageLoaded;
  }

  onRefChanged(canvas) {
    this.canvas = canvas || null;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    if (canvas) {
      this.ctx.fillStyle = SIGNATURE_PLACEHOLDER_COLOR;
      this.drawSignature({progress: 0});
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
    if (drawingWidth) {
      ctx.drawImage(image, 0, 0, drawingWidth, height, 0, 0, drawingWidth, height);
    }
  }

  handleMouseDown(e) {
    const {status} = this.state;
    const {startPath} = this;
    if (status === States.SIGNED) return;

    const isSigning = this.isMouseInBounds(e, startPath);
    this.setState({status: isSigning ? States.SIGNING : States.INITIAL});
  }

  handleMouseMove(e) {
    const {canvas, path, finishPath} = this;
    const {status} = this.state;

    if (!canvas || status === States.SIGNED) return false;

    const pos = this.getMousePos(e);
    if (status === States.SIGNING) {
      const isInBounds = this.isMouseInBounds(e, path);
      const isInFinishZone = this.isMouseInBounds(e, finishPath);
      if (isInBounds) {
        if (isInFinishZone) {
          this.drawSignature({progress: 1});
          this.setState({status: States.SIGNED});
          setTimeout(this.props.onSigned, SIGNATURE_COMPLETION_DELAY);
        } else {
          this.drawSignature({width: pos.x});
        }
      } else {
        this.drawSignature({progress: 0});
        this.setState({status: States.INITIAL});
      }
      return isInBounds;
    }

    return false;
  }

  handleMouseUp() {
    if (this.state.status === States.SIGNING) {
      this.setState({status: States.INITIAL});
      this.drawSignature({progress: 0});
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

  isMouseInBounds(e, path) {
    const {ctx} = this;
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
