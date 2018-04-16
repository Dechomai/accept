import './Products.scss';
import React from 'react';
import {find, compose, prop, propEq} from 'ramda';
import ItemTile from '../common/ItemTile/ItemTile';
import NewItemTile from '../common/ItemTile/NewItemTile';

const TILE_SIZE = 'col-6 col-sm-3';

const ProfileProduct = ({products, onClickEdit}) => {
  return [
    <NewItemTile key="new" type="products" sizes={TILE_SIZE} placeholder="Add listing" />
  ].concat(
    products.map(product => (
      <ItemTile
        key={product.id}
        link={`/products/${product.id}`}
        sizes={TILE_SIZE}
        onClickEdit={e => {
          onClickEdit(e, product.id);
        }}
        editable={true}
        photo={
          product.photos.length
            ? compose(prop('url'), find(propEq('id', product.primaryPhotoId)))(product.photos)
            : null
        }
        price={product.price}
        title={product.title}
      />
    ))
  );
};
export default ProfileProduct;
