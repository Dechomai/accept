import './AllProducts.scss';

import React from 'react';
import PropTypes from 'prop-types';

import ItemTile from '../common/ItemTile/ItemTile';

const TILE_SIZE = 'col-6 col-sm-3';

const AllProducts = ({products}) =>
  products.map(product => (
    <ItemTile
      key={product.id}
      link={`/products/${product.id}`}
      sizes={TILE_SIZE}
      imageUrl={product.photos.length ? product.photos.find(p => p.primary).uri : null}
      price={product.price}
      title={product.title}
    />
  ));

AllProducts.propTypes = {
  products: PropTypes.any
};

export default AllProducts;
