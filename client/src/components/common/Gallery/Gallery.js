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

import {getImageThumbnail} from '../../../utils/img';

import Icon from '../Icon/Icon';
import Tile from '../Tile/Tile';

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
      this.state.activeIndex === this.props.photos.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({activeIndex: nextIndex});
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0 ? this.props.photos.length - 1 : this.state.activeIndex - 1;
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
    const {photos} = this.props;
    return photos.map(item => (
      <CarouselItem onExiting={this.onExiting} onExited={this.onExited} key={item.id}>
        <div
          style={{
            backgroundImage: `url(${getImageThumbnail(item.url, {width: 600, height: 600})})`
          }}
        />
      </CarouselItem>
    ));
  }

  renderPreviews() {
    const {video, photos} = this.props;
    const {activeIndex, isVideoActive} = this.state;
    const photoPreviews = photos.map((photo, index) => (
      <Tile sizes="col-2" key={photo.id}>
        <div
          className={classNames('gallery-previews__item', {
            'gallery-previews__item--active': index === activeIndex
          })}
          onClick={() => this.goToIndex(index)}
          style={{
            backgroundImage: `url(${getImageThumbnail(photo.url, {width: 100, height: 100})})`
          }}
        />
      </Tile>
    ));

    const videoPreview =
      video && video.length ? (
        <Tile sizes="col-2" key={video}>
          <div
            className={classNames('gallery-previews__item', 'gallery-previews__video', {
              'gallery-previews__item--active': isVideoActive
            })}
            onClick={this.toggleVideo}
            style={{backgroundImage: `url(https://img.youtube.com/vi/${video}/0.jpg)`}}>
            <div className="gallery-previews__video__overlay" />
            <Icon className="gallery-previews__video__icon" name="play-circle-outline" />
          </div>
        </Tile>
      ) : null;

    return [...photoPreviews, videoPreview];
  }

  render() {
    const {video, photos, showCarouselIndicators} = this.props;
    const {activeIndex, isVideoActive} = this.state;

    // manually construct Carousel children,
    // since reactstrap has a bug with rendering null|undefined children
    const carouselChildren = [];
    if (photos.length) {
      showCarouselIndicators &&
        carouselChildren.push(
          <CarouselIndicators
            key="indicators"
            items={photos.map(photo => ({key: photo.id}))}
            activeIndex={activeIndex}
            onClickHandler={this.goToIndex}
          />
        );
      carouselChildren.push(this.renderSlides());
      photos.length > 1 &&
        carouselChildren.push(
          <React.Fragment key="controls">
            <CarouselControl
              key="control-prev"
              direction="prev"
              directionText="Previous"
              onClickHandler={this.previous}
            />
            <CarouselControl
              key="control-next"
              direction="next"
              directionText="Next"
              onClickHandler={this.next}
            />
          </React.Fragment>
        );
    }

    return (
      <div className="gallery">
        <div className="carousel-wrapper">
          {photos.length ? (
            <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
              {carouselChildren}
            </Carousel>
          ) : (
            <div
              className="carousel carousel--placeholder"
              style={{
                backgroundImage: `url('/assets/img/placeholder.png')`
              }}
            />
          )}
        </div>
        <div className="gallery-previews row">{this.renderPreviews()}</div>
        <Modal isOpen={isVideoActive} toggle={this.toggleVideo} className="gallery-video-popup">
          <ModalHeader className="gallery-video-popup__header" toggle={this.toggleVideo} />
          <ModalBody className="gallery-video-popup__body">
            <iframe
              className="gallery-video-popup__frame"
              src={`https://www.youtube.com/embed/${video}?autoplay=1`}
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
  photos: PropTypes.array.isRequired,
  video: PropTypes.string,
  showCarouselIndicators: PropTypes.bool
};

Gallery.defaultProps = {
  showCarouselIndicators: false
};

export default Gallery;
