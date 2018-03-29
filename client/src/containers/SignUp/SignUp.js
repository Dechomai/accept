import './SignUp.scss';

import React from 'react';
import {connect} from 'react-redux';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

const SignUp = () => {
  return (
    <div className="sign-up">
      <div className="container">
        <div className="sign-up__page">
          <h4 className="sign-up__header">Complete your registration, create personal profile</h4>
          <h6 className="sign-up__subheader">Please fill in all the required fields</h6>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
