import './UserPanel.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';

import Icon from '../common/Icon/Icon';
import UserAvatar from '../UserAvatar/UserAvatar';

const UserPanel = ({user, isCurrentUser}) => {
  if (!user || !user.data || user.loading) return null;
  return (
    <div className="user-panel">
      <div className="user-panel__details">
        <UserAvatar user={user.data} size="lg" />
        <span className="user-panel__name">@{user.data.username}</span>
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
          <Button size="sm" color="link" className="btn-with-icon user-panel__edit" disabled>
            <Icon name="pencil" size="20" />
            <span>Edit personal info</span>
          </Button>
        ) : (
          <Button color="primary" className="user-panel__contact" disabled>
            Contact
          </Button>
        )}
      </div>
    </div>
  );
};

UserPanel.propTypes = {
  isCurrentUser: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default UserPanel;
