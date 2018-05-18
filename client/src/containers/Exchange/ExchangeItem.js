import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompact';

import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';
import {selectProductById, selectServiceById} from '../../selectors';

import {shouldRefetchItem, isItemLoading} from '../../utils/refetch';
import Loader from '../../components/common/Loader/Loader';
import ExchangeItem from '../../components/Exchange/ExchangeItem';

const mapStateToProps = (state, {itemId, type}) => ({
  item: type === 'product' ? selectProductById(state, itemId) : selectServiceById(state, itemId)
});

const mapDispatchToProps = (dispatch, {itemId, type}) => {
  return {
    fetchItem() {
      return dispatch(type === 'product' ? fetchProductById(itemId) : fetchServiceById(itemId));
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
  if (isItemLoading(item)) return <Loader />;
  return <ExchangeItem item={item.data} {...props} />;
});
