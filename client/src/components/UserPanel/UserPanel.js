import './UserPanel.scss';

import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../common/Icon/Icon';
import UserAvatar from '../UserAvatar/UserAvatar';

const UserPanel = ({user, isCurrentUser}) => (
  <div className="user-panel">
    <div className="user-panel__details">
      <UserAvatar user={user} size="lg" />
      <span className="user-panel__name">@{user.username}</span>
      {/*
      Do not show user location
      <div className="user-panel__location">
        <Icon name="map-marker" size="20" />
        <span>Lviv, UA</span>
      </div>
      */}
    </div>
    <div className="user-panel__actions">
      {isCurrentUser ? (
        <button className="btn-with-icon user-panel__edit">
          <Icon name="pencil" size="20" />
          <span>Edit personal info</span>
        </button>
      ) : (
        <button className="btn btn-primary user-panel__contact">Contact</button>
      )}
    </div>
  </div>
);

UserPanel.propTypes = {
  isCurrentUser: PropTypes.bool.isRequired,
  user: PropTypes.object,
  status: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any
  }).isRequired
};

export default UserPanel;
