import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import {fetchUser} from '../../actions/user';
import {selectUserStatus, selectUserData} from '../../selectors';
import Header from '../../components/Header/Header';
import HeaderPlain from '../../components/Header/HeaderPlain';

const mapStateToProps = state => ({
  status: selectUserStatus(state),
  user: selectUserData(state)
});
const mapDispatchToProps = dispatch => ({
  fetchUser() {
    return dispatch(fetchUser());
  }
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(props => {
    if (props.location.pathname === '/signup') return <HeaderPlain />;
    return <Header {...props} />;
  })
);
