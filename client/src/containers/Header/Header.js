import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import {fetchProfile} from '../../actions/user';
import {selectProfile} from '../../selectors';
import Header from '../../components/Header/Header';
import HeaderPlain from '../../components/Header/HeaderPlain';

const mapStateToProps = state => ({
  user: selectProfile(state)
});

const mapDispatchToProps = dispatch => ({
  fetchProfile() {
    return dispatch(fetchProfile());
  }
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(props => {
    if (props.location.pathname === '/signup-finish' || '/signup-join-accept')
      return <HeaderPlain />;
    return <Header {...props} />;
  })
);
