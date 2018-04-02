import './Profile.scss';

import React from 'react';
import {Link} from 'react-router';

import UserPanel from '../UserPanel/UserPanel';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;

    return (
      <div className="profile">
        <div className="profile__container container">
          <div className="row">
            <div className="col-md-3">
              <UserPanel isOwn />
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
      </div>
    );
  }
}

Profile.propTypes = {};

export default Profile;
