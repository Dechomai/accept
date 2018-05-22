import './Step3.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompact';

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
  onOwnDaysChange(days) {
    return dispatch(changeOwnDays(days));
  },
  onOwnTimeChange(time) {
    return dispatch(changeOwnTime(time));
  }
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      if (!this.props.itemId) {
        this.props.onDataAbsent();
      }
    }
  })
)(({itemId, ...props}) => (
  <ExchangeItem {...props} itemId={itemId} title="Your offer" own className="exchange-step3" />
));
