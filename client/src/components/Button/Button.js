import './Button.scss';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// TODO: handle icons
const Button = ({type, size, children}) => {
  return <button className={classNames('btn', `btn-${type}`, `btn-${size}`)}>{children}</button>;
};

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['sm', 'lg'])
};

Button.defaultProps = {
  type: 'primary'
};

export default Button;
