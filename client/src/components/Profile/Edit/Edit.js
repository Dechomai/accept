import './Edit.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {pick} from 'ramda';

import PersonalInfo from './PersonalInfo';
import PublicInfo from './PublicInfo';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFormSubmit(info) {
    return this.props.updateProfile(info);
  }

  render() {
    const {status, profile, updateProfile} = this.props;
    if (!profile) return null;

    const personalInfo = pick(['firstName', 'lastName', 'phone'], profile);
    const publicInfo = pick(['username', 'address'], profile);

    return (
      <div className="edit-profile container">
        <div className="edit-profile__account-info">Account information</div>
        <div className="edit-profile__personal-info">
          <span>Personal information</span>
          <PersonalInfo
            {...personalInfo}
            loading={status.loading}
            error={status.error}
            onSubmit={updateProfile}
          />
        </div>
        <div className="edit-profile__public-info">
          Public information
          <PublicInfo
            {...publicInfo}
            loading={status.loading}
            error={status.error}
            onSubmit={updateProfile}
          />
        </div>
        {/* <div className="edit-profile__close-account">
          <div className="edit-profile__close-account__info">
            Close my account
            <Icon className="edit-profile__close-account__icon" name="information" size="20" />
          </div>
          <Button outline className="edit-profile__close-account__button" disabled>
            Close Account
          </Button>
        </div> */}
      </div>
    );
  }
}

EditProfile.propTypes = {
  status: PropTypes.object,
  profile: PropTypes.object,
  updateProfile: PropTypes.func.isRequired
};

export default EditProfile;
