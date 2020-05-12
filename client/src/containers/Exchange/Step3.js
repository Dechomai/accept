import './Step3.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompact';

import {
  selectExchangeOwnCount,
  selectExchangeOwnDays,
  selectExchangeOwnTime
} from '../../selectors';
import {changeOwnCount, changeOwnDays, changeOwnTime} from '../../actions/exchange';
import ExchangeItem from '../../containers/Exchange/ExchangeItem';
import withDataEnsurance from '../../hoc/exchange/withDataEnsurance';

const mapStateToProps = state => ({
  quantity: selectExchangeOwnCount(state),
  days: selectExchangeOwnDays(state),
  time: selectExchangeOwnTime(state)
});

const mapDispatchToProps = dispatch => ({
  onQuantityChange(count) {
    return dispatch(changeOwnCount(count));
  },
  onOwnDaysChange(days) {
    return dispatch(changeOwnDays(days));
  },
  onOwnTimeChange(time) {
    return dispatch(changeOwnTime(time));
  }
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDataEnsurance(['itemId'])
)(({itemId, ...props}) => (
  <ExchangeItem {...props} itemId={itemId} title="Your offer" own className="exchange-step3" />
));
