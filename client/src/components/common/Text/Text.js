import React from 'react';
import PropTypes from 'prop-types';

class Text extends React.Component {
  constructor(props) {
    super(props);

    this.adjustTextSize = this.adjustTextSize.bind(this);
    this.state = {
      displayText: props.children
    };
  }

  componentDidUpdate() {
    this.adjustTextSize();
  }

  adjustTextSize(container) {
    container = container || this.container;

    if (!container) {
      return;
    }

    this.container = container;

    const {rows, children: text} = this.props;

    if (rows) {
      const containerStyle = window.getComputedStyle(container);
      const height = parseInt(containerStyle.height);
      const lineHeight = parseInt(containerStyle.lineHeight);
      const currentRows = height / lineHeight;

      const extraRows = currentRows - rows;
      const charsPerRow = text.length / currentRows;

      if (extraRows > 0) {
        const displayText = text.slice(0, charsPerRow * rows - 3).trim() + '...';

        this.setState({displayText});
      }
    } else {
      if (text !== this.state.displayText) {
        this.setState({displayText: text});
      }
    }
  }

  render() {
    const {className} = this.props;
    const {displayText} = this.state;

    return (
      <div ref={this.adjustTextSize} className={className || ''}>
        {displayText}
      </div>
    );
  }
}

Text.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.number,
  children: PropTypes.string.isRequired
};

export default Text;
