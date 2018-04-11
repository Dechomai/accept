import './ItemTile.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ItemTile = ({className, sizes, photo, price, title}) => {
  return (
    <div className={classNames(sizes, 'item-tile', className)}>
      <div className="item-tile__photo" style={{backgroundImage: `url(${photo})`}} />
      <div className="item-tile__price">{price}</div>
      <div className="item-tile__title">{title}</div>
    </div>
  );
};

ItemTile.propTypes = {
  className: PropTypes.string,
  sizes: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  title: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired
};

export default ItemTile;
