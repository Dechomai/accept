import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, assoc, pick} from 'ramda';
import autobind from 'autobindr';

import {createProfile} from '../../actions/user';
import {selectProfile} from '../../selectors';
import SignUpStep2 from '../../components/SignUp/Step2';

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
      <SignUpStep2
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

const mapStateToProps = state => {
  const profile = selectProfile(state);
  return {status: profile && pick(['loading', 'error'], profile)};
};

const mapDispatchToProps = dispatch => ({
  createProfile(profile) {
    return dispatch(createProfile(profile));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignUp);
