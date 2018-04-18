import './Gallery.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import autobind from 'autobindr';
import classNames from 'classnames';

import Icon from '../Icon/Icon';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeIndex: 0, isVideoActive: false};
    autobind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === this.props.items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({activeIndex: nextIndex});
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0 ? this.props.items.length - 1 : this.state.activeIndex - 1;
    this.setState({activeIndex: nextIndex});
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({activeIndex: newIndex});
  }

  toggleVideo() {
    const {isVideoActive} = this.state;

    this.setState({isVideoActive: !isVideoActive});
  }

  renderSlides() {
    return this.props.items.map(item => (
      <CarouselItem onExiting={this.onExiting} onExited={this.onExited} key={item.id}>
        <div style={{backgroundImage: `url(${item.url})`}} />
      </CarouselItem>
    ));
  }

  renderPreviews() {
    const {items, video} = this.props;
    const {activeIndex, isVideoActive} = this.state;

    const photoPreviews = items.map((item, index) => (
      <div
        className={classNames('gallery-previews__item', {
          'gallery-previews__item--active': index === activeIndex
        })}
        onClick={() => {
          this.goToIndex(index);
        }}
        key={item.id}
        style={{backgroundImage: `url(${item.url})`}}
      />
    ));

    const videoPreview =
      video && video.length ? (
        <div
          className={classNames('gallery-previews__item', 'gallery-previews__video', {
            'gallery-previews__item--active': isVideoActive
          })}
          onClick={this.toggleVideo}
          key={video}
          style={{backgroundImage: `url(https://img.youtube.com/vi/${video}/0.jpg)`}}>
          <div className="gallery-previews__video__overlay" />
          <Icon className="gallery-previews__video__icon" name="play-circle-outline" />
        </div>
      ) : null;

    return [...photoPreviews, videoPreview];
  }

  render() {
    const {video} = this.props;
    const {activeIndex, isVideoActive} = this.state;

    return (
      <div className="gallery">
        <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
          <CarouselIndicators
            items={this.props.items.map(item => ({key: item.id}))}
            activeIndex={activeIndex}
            onClickHandler={this.goToIndex}
          />
          {this.renderSlides()}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={this.previous}
          />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
        <div className="gallery-previews">{this.renderPreviews()}</div>
        <Modal isOpen={isVideoActive} toggle={this.toggleVideo} className="gallery-video-popup">
          <ModalHeader className="gallery-video-popup__header" toggle={this.toggleVideo} />
          <ModalBody className="gallery-video-popup__body">
            <iframe
              className="gallery-video-popup__frame"
              src={`https://www.youtube.com/embed/${video}`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

Gallery.propTypes = {
  items: PropTypes.array.isRequired,
  video: PropTypes.string
};

export default Gallery;
