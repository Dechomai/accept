import './Products.scss';
import React from 'react';
import NewItemTile from '../common/ItemTile/NewItemTile';
import ProductsList from '../Products/ProductsList';

const TILE_SIZE = 'col-6 col-sm-3';

const ProfileProduct = ({products, onEditClick, onDeleteClick}) => {
  return [
    <NewItemTile key="new" type="products" sizes={TILE_SIZE} placeholder="Add listing" />
  ].concat(
    <ProductsList
      key="list"
      list={products}
      tileSize={TILE_SIZE}
      editable={true}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  );
};
export default ProfileProduct;
