import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'ramda';

import SignUpStep3 from '../../components/SignUp/Step3';

class SignUp extends React.Component {
  render() {
    return <SignUpStep3 />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignUp);
