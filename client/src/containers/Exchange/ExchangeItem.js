import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompact';

import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';
import {
  selectProductById,
  selectServiceById,
  selectExchangePartnerDays,
  selectExchangePartnerTime
} from '../../selectors';

import {shouldRefetchItem, isItemLoading} from '../../utils/refetch';
import Loader from '../../components/common/Loader/Loader';
import ExchangeItem from '../../components/Exchange/ExchangeItem';
import {changePartnerDays, changePartnerTime} from '../../actions/exchange';

const mapStateToProps = (state, {itemId, type}) => ({
  item: type === 'product' ? selectProductById(state, itemId) : selectServiceById(state, itemId),
  partnerDays: selectExchangePartnerDays(state),
  partnerTime: selectExchangePartnerTime(state)
});

const mapDispatchToProps = (dispatch, {itemId, type}) => {
  return {
    fetchItem() {
      return dispatch(type === 'product' ? fetchProductById(itemId) : fetchServiceById(itemId));
    },
    onPartnerDaysChange(days) {
      return dispatch(changePartnerDays(days));
    },
    onPartnerTimeChange(time) {
      return dispatch(changePartnerTime(time));
    }
  };
};

const refetchItem = ({item, fetchItem}) => {
  if (shouldRefetchItem(item)) fetchItem();
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      refetchItem(this.props);
    }
  })
)(({item, ...props}) => {
  console.log(props);
  if (isItemLoading(item)) return <Loader />;
  return <ExchangeItem item={item.data} {...props} />;
});
