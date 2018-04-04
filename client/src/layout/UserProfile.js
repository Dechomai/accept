import './UserProfile.scss';

import React from 'react';
import {Link} from 'react-router';

import UserPanel from '../containers/UserPanel/UserPanel';

const UserProfile = ({children}) => {
  return (
    <div className="user-profile__page">
      <div className="user-profile__header">
        <div className="container">
          <h4>My Profile</h4>
        </div>
      </div>
      <div className="user-profile__content container">
        <div className="row">
          <div className="col-md-3">
            <UserPanel />
          </div>
          <div className="col-md-9">
            <nav className="user-profile__nav">
              <Link
                to="/profile"
                className="user-profile__nav-item"
                activeClassName="user-profile__nav-item--active"
                onlyActiveOnIndex>
                About
              </Link>
              <Link
                to="/profile/products"
                className="user-profile__nav-item"
                activeClassName="user-profile__nav-item--active">
                Products
              </Link>
              <Link
                to="/profile/services"
                className="user-profile__nav-item"
                activeClassName="user-profile__nav-item--active">
                Services
              </Link>
            </nav>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
