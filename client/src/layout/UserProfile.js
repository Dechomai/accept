import React from 'react';

import ProfileContainer from '../containers/Profile/Profile';

const UserProfile = ({children, params: {userId}}) => {
  return (
    <div className="user-profile__page">
      <div className="user-profile__header">
        <div className="container">
          <h4>My Profile</h4>
        </div>
      </div>
      <ProfileContainer userId={userId}>{children}</ProfileContainer>
    </div>
  );
};

export default UserProfile;
