import './Services.scss';
import React from 'react';
import NewItemTile from '../common/Item/NewItemTile';
import ItemsList from '../common/Item/List';

const TILE_SIZE = 'col-6 col-sm-3';

const ProfileService = ({services, onEditClick, onDeleteClick, editable}) => {
  return (
    <React.Fragment>
      {editable && (
        <NewItemTile key="new" type="services" sizes={TILE_SIZE} placeholder="Offer service" />
      )}
      <ItemsList
        key="list"
        type="services"
        list={services}
        tileSize={TILE_SIZE}
        editable={editable}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    </React.Fragment>
  );
};
export default ProfileService;
