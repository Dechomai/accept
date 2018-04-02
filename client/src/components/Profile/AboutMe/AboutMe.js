import React from 'react';

import Icon from '../../common/Icon/Icon';
import ProfileSection from '../ProfileSection/ProfileSection';

const LabelWithPlusSign = text => (
  <React.Fragment>
    <Icon
      name="plus"
      style={{
        position: 'absolute',
        left: '18px'
      }}
    />
    <span>{text}</span>
  </React.Fragment>
);

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <ProfileSection
          className="profile__description"
          imageUrl="/assets/img/about.png"
          placeholder="Write something about yourself..."
          buttonContent="Add description"
        />
        <ProfileSection
          className="profile__listings"
          imageUrl="/assets/img/product.png"
          placeholder="Here will be displayed your created listings"
          buttonContent={LabelWithPlusSign('Create listing')}
        />
        <ProfileSection
          className="profile__services"
          imageUrl="/assets/img/service.png"
          placeholder="Here will be displayed your services"
          buttonContent={LabelWithPlusSign('Offer service')}
        />
      </React.Fragment>
    );
  }
}

Profile.propTypes = {};

export default Profile;
