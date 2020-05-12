import './Products.scss';
import React from 'react';
import NewItemTile from '../common/Item/NewItemTile';
import ItemsList from '../common/Item/List';

const TILE_SIZE = 'col-6 col-sm-3';

const ProfileProduct = ({products, onEditClick, onDeleteClick, editable}) => {
  return (
    <React.Fragment>
      {editable && (
        <NewItemTile key="new" type="products" sizes={TILE_SIZE} placeholder="Add listing" />
      )}
      <ItemsList
        key="list"
        type="products"
        list={products}
        tileSize={TILE_SIZE}
        editable={editable}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    </React.Fragment>
  );
};
export default ProfileProduct;
