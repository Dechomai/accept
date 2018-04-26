import React from 'react';
import PropTypes from 'prop-types';
import ItemTile from './ItemTile';
import {getPrimaryImage} from '../../../utils/img';

const ItemsList = ({of, list, tileSize, editable, onEditClick, onDeleteClick}) =>
  list.map(item => (
    <ItemTile
      key={item.id}
      link={`/${of}/${item.id}`}
      sizes={tileSize}
      imageUrl={getPrimaryImage(item)}
      price={item.price}
      title={item.title}
      editable={editable}
      onEditClick={e => {
        onEditClick(e, item.id);
      }}
      onDeleteClick={() => {
        onDeleteClick(item.id);
      }}
    />
  ));

ItemsList.propTypes = {
  of: PropTypes.oneOf(['products', 'services']).isRequired,
  list: PropTypes.any.isRequired,
  tileSize: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func
};

export default ItemsList;
