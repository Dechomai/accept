import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, pick} from 'ramda';
import autobind from 'autobindr';

import SignUpStep3 from '../../components/SignUp/Step3';
import {confirmProfile} from '../../actions/user';
import {selectProfile} from '../../selectors';
import PropTypes from 'prop-types';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleFormSubmit(data) {
    return this.props.confirmProfile(data).then(() => {
      this.props.router.push('/');
    });
  }

  render() {
    return (
      <SignUpStep3
        loading={this.props.status.loading}
        error={this.props.status.error}
        onSubmit={this.handleFormSubmit}
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
  confirmProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  return {status: profile && pick(['loading', 'error'], profile)};
};

const mapDispatchToProps = dispatch => ({
  confirmProfile(data) {
    return dispatch(confirmProfile(data));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignUp);
