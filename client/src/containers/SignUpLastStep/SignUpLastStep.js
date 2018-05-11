import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'ramda';

import SignUpLastStep from '../../components/SignUpLastStep/SignUp';

class SignUp extends React.Component {
  render() {
    return <SignUpLastStep />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignUp);
