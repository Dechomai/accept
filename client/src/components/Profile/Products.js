import './Products.scss';
import React from 'react';
import ItemTile from '../common/ItemTile/ItemTile';
import NewItemTile from '../common/ItemTile/NewItemTile';

const TILE_SIZE = 'col-6 col-sm-3';

const ProfileProduct = ({products}) => {
  return [
    <NewItemTile key="new" type="products" sizes={TILE_SIZE} placeholder="Add listing" />
  ].concat(
    products.map(product => (
      <ItemTile
        key={product.id}
        link={`/products/${product.id}`}
        sizes={TILE_SIZE}
        editable={true}
        photo={product.photos.length ? product.photos.find(p => p.primary).uri : null}
        price={product.price}
        title={product.title}
      />
    ))
  );
  // }
};

export default ProfileProduct;
