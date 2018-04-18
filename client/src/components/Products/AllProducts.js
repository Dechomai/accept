import './AllProducts.scss';

import React from 'react';
import PropTypes from 'prop-types';

import ItemTile from '../common/ItemTile/ItemTile';
import {getProductPrimaryImage} from '../../utils/img';

const TILE_SIZE = 'col-6 col-sm-3';

const AllProducts = ({products}) =>
  products.map(product => (
    <ItemTile
      key={product.id}
      link={`/products/${product.id}`}
      sizes={TILE_SIZE}
      imageUrl={getProductPrimaryImage(product)}
      price={product.price}
      title={product.title}
    />
  ));

AllProducts.propTypes = {
  products: PropTypes.any
};

export default AllProducts;
