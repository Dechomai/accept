import React from 'react';
import PropTypes from 'prop-types';
import ItemTile from '../common/ItemTile/ItemTile';
import {getProductPrimaryImage} from '../../utils/img';

const ProductsList = ({list, tileSize, editable, onEditClick, onDeleteClick}) =>
  list.map(product => (
    <ItemTile
      key={product.id}
      link={`/products/${product.id}`}
      sizes={tileSize}
      imageUrl={getProductPrimaryImage(product)}
      price={product.price}
      title={product.title}
      editable={editable}
      onEditClick={e => {
        onEditClick(e, product.id);
      }}
      onDeleteClick={() => {
        onDeleteClick(product.id);
      }}
    />
  ));

ProductsList.propTypes = {
  list: PropTypes.any.isRequired,
  tileSize: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func
};

export default ProductsList;
