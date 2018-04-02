import './Profile.scss';

import React from 'react';
import {Link} from 'react-router';

import Icon from '../common/Icon/Icon';
import UserPanel from '../UserPanel/UserPanel';
import ProfileSection from '../ProfileSection/ProfileSection';

const LabelWithPlusSign = text => (
  <div>
    <Icon
      name="plus"
      style={{
        position: 'absolute',
        left: '18px'
      }}
    />
    <span>{text}</span>
  </div>
);

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="profile">
        <div className="profile__container container">
          <div className="row">
            <div className="col-md-3">
              <UserPanel isOwn />
            </div>
            <div className="col-md-9">
              <div className="profile__head">
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
                    activeClassName="header__nav-item--active">
                    Products
                  </Link>
                  <Link
                    to="/profile/services"
                    className="profile__nav-item"
                    activeClassName="profile__nav-item--active">
                    Services
                  </Link>
                </nav>
                <ProfileSection
                  className="profile__description"
                  imageUrl="/assets/images/about.png"
                  placeholder="Write something about yourself..."
                  buttonContent="Add description"
                />
              </div>
              <ProfileSection
                className="profile__listings"
                imageUrl="/assets/images/product.png"
                placeholder="Here will be displayed your created listings"
                buttonContent={LabelWithPlusSign('Create listing')}
              />
              <ProfileSection
                className="profile__services"
                imageUrl="/assets/images/service.png"
                placeholder="Here will be displayed your services"
                buttonContent={LabelWithPlusSign('Offer service')}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {};

export default Profile;
