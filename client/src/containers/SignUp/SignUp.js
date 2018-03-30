import './SignUp.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'ramda';
import autobind from 'autobindr';

import {createProfile} from '../../actions/user';
import {selectUserStatus} from '../../selectors';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

class SignUp extends React.Component {
  constructor() {
    super();
    autobind(this);
  }

  handleFormSubmit(profile) {
    return this.props.createProfile(profile).then(() => {
      this.props.router.push('/profile');
    });
  }

  render() {
    return (
      <div className="sign-up">
        <div className="container">
          <div className="sign-up__page">
            <h4 className="sign-up__header">Complete your registration, create personal profile</h4>
            <h6 className="sign-up__subheader">Please fill in all the required fields</h6>
            <SignUpForm
              loading={this.props.status.loading}
              error={this.props.status.error}
              onSubmit={this.handleFormSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  router: PropTypes.any,
  status: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any
  }),
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  status: selectUserStatus(state)
});

const mapDispatchToProps = dispatch => ({
  createProfile(profile) {
    return dispatch(createProfile(profile));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignUp);
