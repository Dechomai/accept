import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Icon = ({name, size, className}) => (
  <i className={classNames('icon', 'mdi', `mdi-${name}`, `mdi-${size}px`, className)} />
);

export const iconSizes = ['12', '16', '20', '24', '32', '36'];

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(iconSizes)
};

Icon.defaultProps = {
  className: '',
  size: '24'
};

export default Icon;
