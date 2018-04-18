import './Gallery.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Carousel, CarouselItem, CarouselControl, CarouselIndicators} from 'reactstrap';
import autobind from 'autobindr';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeIndex: 0};
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

  render() {
    const {activeIndex} = this.state;
    const {items} = this.props;

    const slides = items.map(item => {
      return (
        <CarouselItem onExiting={this.onExiting} onExited={this.onExited} key={item.id}>
          <div style={{backgroundImage: `url(${item.url})`}} />
        </CarouselItem>
      );
    });

    return (
      <Carousel
        activeIndex={activeIndex}
        className="gallery"
        next={this.next}
        previous={this.previous}>
        <CarouselIndicators
          items={this.props.items.map(item => ({key: item.id}))}
          activeIndex={activeIndex}
          onClickHandler={this.goToIndex}
        />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
      </Carousel>
    );
  }
}

Gallery.propTypes = {
  items: PropTypes.array.isRequired
};

export default Gallery;
