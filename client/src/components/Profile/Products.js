import './Products.scss';
import React from 'react';
import NewItemTile from '../common/ItemTile/NewItemTile';
import ProductsList from '../Product/List';

const TILE_SIZE = 'col-6 col-sm-3';

const ProfileProduct = ({products, onEditClick, onDeleteClick, editable}) => {
  return (
    <React.Fragment>
      {editable && (
        <NewItemTile key="new" type="products" sizes={TILE_SIZE} placeholder="Add listing" />
      )}
      <ProductsList
        key="list"
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
