import './UserAvatar.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const getInitials = user =>
  user.firstName && user.lastName && `${user.firstName[0]}${user.lastName[0]}`;

const UserAvatar = ({user, size}) => {
  return (
    <div className={classNames('user-avatar', `user-avatar--${size}`)}>
      {user.photoUrl ? (
        <img src={user.photoUrl} alt="" />
      ) : (
        <span className="user-avatar__initials">{getInitials(user)}</span>
      )}
    </div>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['sm', 'lg'])
};

UserAvatar.defaultProps = {
  size: 'sm'
};

export default UserAvatar;
