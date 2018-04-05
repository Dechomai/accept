import React from 'react';
import PropTypes from 'prop-types';

class Text extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: this.truncateText(props.children, props.maxCharacters)
    };
  }

  componentWillReceiveProps(nextProps) {
    const newText = this.truncateText(nextProps.children, nextProps.maxCharacters);

    if (newText !== this.state.displayText) {
      this.setState({displayText: newText});
    }
  }

  truncateText(text, maxCharacters) {
    return maxCharacters && text.length > maxCharacters
      ? text.slice(0, maxCharacters).trim() + '...'
      : text;
  }

  render() {
    const {className} = this.props;
    const {displayText} = this.state;

    return <div className={className || ''}>{displayText}</div>;
  }
}

Text.propTypes = {
  className: PropTypes.string,
  maxCharacters: PropTypes.number,
  children: PropTypes.string.isRequired
};

export default Text;
