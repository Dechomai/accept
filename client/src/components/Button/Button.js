import './Button.scss';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// TODO: handle icons
const Button = ({type, size, children}) => {
  return (
    <button className={classNames('button', `button--${type}`, `button--${size}`)}>
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['default', 'small'])
};

Button.defaultProps = {
  type: 'primary',
  size: 'default'
};

export default Button;
