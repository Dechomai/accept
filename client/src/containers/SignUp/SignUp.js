import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, assoc} from 'ramda';
import autobind from 'autobindr';

import {createProfile} from '../../actions/user';
import {selectUserStatus} from '../../selectors';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      avatar: null
    };
    autobind(this);
  }

  handleAvatarSelect(avatar) {
    this.setState({avatar});
  }

  handleFormSubmit(profile) {
    let data = profile;
    if (this.state.avatar) {
      data = assoc('avatar', this.state.avatar, profile);
    }
    return this.props.createProfile(data).then(() => {
      this.props.router.push('/profile');
    });
  }

  render() {
    return (
      <SignUpForm
        loading={this.props.status.loading}
        error={this.props.status.error}
        onSubmit={this.handleFormSubmit}
        onPhotoSelect={this.handleAvatarSelect}
      />
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
