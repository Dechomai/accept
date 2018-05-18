import './Step3.scss';

import React from 'react';
import {connect} from 'react-redux';

import {
  selectExchangeOwnCount,
  selectExchangeOwnDays,
  selectExchangeOwnTime
} from '../../selectors';
import {changeOwnCount, changeOwnDays, changeOwnTime} from '../../actions/exchange';
import ExchangeItem from '../../containers/Exchange/ExchangeItem';

const mapStateToProps = state => ({
  quantity: selectExchangeOwnCount(state),
  days: selectExchangeOwnDays(state),
  time: selectExchangeOwnTime(state)
});

const mapDispatchToProps = dispatch => ({
  onQuantityChange(count) {
    return dispatch(changeOwnCount(count));
  },
  onDaysChange(days) {
    return dispatch(changeOwnDays(days));
  },
  onTimeChange(time) {
    return dispatch(changeOwnTime(time));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(({itemId, ...props}) => (
  <ExchangeItem {...props} itemId={itemId} title="Your offer" own className="exchange-step3" />
));
