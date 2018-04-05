import './Tile.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Tile = ({className, tileClassName, sizes, children}) => {
  return (
    <div className={sizes}>
      <div className={classNames('tile', tileClassName)}>
        <div className={classNames('tile__content', className)}>{children}</div>
      </div>
    </div>
  );
};

Tile.propTypes = {
  className: PropTypes.string,
  tileClassName: PropTypes.string,
  sizes: PropTypes.string.isRequired
};

export default Tile;
