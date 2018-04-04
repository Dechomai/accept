import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Icon = ({name, size, className, style}) => (
  <i
    className={classNames('icon', 'mdi', `mdi-${name}`, `mdi-${size}px`, className)}
    style={style}
  />
);

export const iconSizes = ['12', '16', '20', '24', '32', '64'];

Icon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(iconSizes)
};

Icon.defaultProps = {
  className: '',
  size: '24',
  style: {}
};

export default Icon;
