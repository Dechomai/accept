import './Profile.scss';

import React from 'react';
import {Link} from 'react-router';

import UserPanel from '../../containers/UserPanel/UserPanel';

const Profile = ({children, isCurrentUser, params: {userId}, productsCount, servicesCount}) => {
  return (
    <div className="user-profile__content container">
      <div className="row">
        <div className="col-md-3">
          <UserPanel userId={userId} />
        </div>
        <div className="col-md-9">
          <nav className="user-profile__nav">
            <Link
              to={isCurrentUser ? '/profile' : `/users/${userId}`}
              className="user-profile__nav-item"
              activeClassName="user-profile__nav-item--active"
              onlyActiveOnIndex>
              About
            </Link>
            <Link
              to={isCurrentUser ? '/profile/products' : `/users/${userId}/products`}
              className="user-profile__nav-item"
              activeClassName="user-profile__nav-item--active">
              {`Products ${productsCount ? `(${productsCount})` : ''}`}
            </Link>
            <Link
              to={isCurrentUser ? '/profile/services' : `/users/${userId}/services`}
              className="user-profile__nav-item"
              activeClassName="user-profile__nav-item--active">
              {`Services ${servicesCount ? `(${servicesCount})` : ''}`}
            </Link>
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Profile;
