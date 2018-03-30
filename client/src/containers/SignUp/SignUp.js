import './SignUp.scss';

import React from 'react';
import {connect} from 'react-redux';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import {createProfile} from '../../actions/createProfile';
import {selectUserData, selectUserStatus} from '../../selectors';

const SignUp = props => {
  return (
    <div className="sign-up">
      <div className="container">
        <div className="sign-up__page">
          <h4 className="sign-up__header">Complete your registration, create personal profile</h4>
          <h6 className="sign-up__subheader">Please fill in all the required fields</h6>
          <SignUpForm {...props} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  status: selectUserStatus(state),
  user: selectUserData(state)
});

const mapDispatchToProps = dispatch => ({
  createProfile(profile) {
    return dispatch(createProfile(profile));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
