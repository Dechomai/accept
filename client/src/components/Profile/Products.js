import './Products.scss';
import React from 'react';
import ItemTile from '../common/ItemTile/ItemTile';
import NewItemTile from '../common/ItemTile/NewItemTile';
import {getProductPrimaryImage} from '../../utils/img';

const TILE_SIZE = 'col-6 col-sm-3';

const ProfileProduct = ({products, onEditClick}) => {
  return [
    <NewItemTile key="new" type="products" sizes={TILE_SIZE} placeholder="Add listing" />
  ].concat(
    products.map(product => (
      <ItemTile
        key={product.id}
        link={`/products/${product.id}`}
        sizes={TILE_SIZE}
        onEditClick={e => {
          onEditClick(e, product.id);
        }}
        onDeleteClick={() => {
          console.log('item deleted');
        }}
        editable={true}
        imageUrl={getProductPrimaryImage(product)}
        price={product.price}
        title={product.title}
      />
    ))
  );
};
export default ProfileProduct;
