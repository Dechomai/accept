import './UserLink.scss';
import classNames from 'classnames';
import React from 'react';
import {Link} from 'react-router';

import UserAvatar from '../../UserAvatar/UserAvatar';

const UserLink = ({className, user, isOwner}) => (
  <Link
    className={classNames('user-link', className)}
    to={isOwner ? '/profile' : `/users/${user.id}`}>
    <UserAvatar user={user} />
    <span className="user-link__username">{user.username}</span>
  </Link>
);

export default UserLink;
