import './ItemTile.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router';

const ItemTile = ({className, sizes, photo, price, title, link}) => {
  const imgUrl = photo || 'http://placehold.it/200x200';
  const Component = link ? Link : 'div';
  const props = link ? {to: link} : {};

  return (
    <Component
      {...props}
      className={classNames(sizes, 'item-tile', className, {
        'item-tile--link': link
      })}>
      <div className="item-tile__photo" style={{backgroundImage: `url(${imgUrl})`}} />
      <div className="item-tile__price">{price}</div>
      <div className="item-tile__title">{title}</div>
    </Component>
  );
};

ItemTile.propTypes = {
  className: PropTypes.string,
  sizes: PropTypes.string.isRequired,
  photo: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  link: PropTypes.string
};

export default ItemTile;
