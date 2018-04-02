import './UserProfile.scss';

import React from 'react';
import {Link} from 'react-router';

import UserPanel from '../containers/UserPanel/UserPanel';

const UserProfile = ({children}) => {
  return (
    <div className="user-profile container">
      <div className="row">
        <div className="col-md-3">
          <UserPanel />
        </div>
        <div className="col-md-9">
          <nav className="profile__nav">
            <Link
              to="/profile"
              className="profile__nav-item"
              activeClassName="profile__nav-item--active"
              onlyActiveOnIndex>
              About
            </Link>
            <Link
              to="/profile/products"
              className="profile__nav-item"
              activeClassName="profile__nav-item--active">
              Products
            </Link>
            <Link
              to="/profile/services"
              className="profile__nav-item"
              activeClassName="profile__nav-item--active">
              Services
            </Link>
          </nav>
          <div className="profile__content">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
