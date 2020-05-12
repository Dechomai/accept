import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose} from 'recompact';

import {selectProfile} from '../../selectors';
import Header from '../../components/Header/Header';
import HeaderPlain from '../../components/Header/HeaderPlain';

const mapStateToProps = state => ({
  user: selectProfile(state)
});

const mapDispatchToProps = () => ({});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(props => {
  if (['/signup-step2', '/signup-step3'].includes(props.location.pathname)) return <HeaderPlain />;
  return <Header {...props} />;
});
