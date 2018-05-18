import './Step5.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle, withProps} from 'recompact';

import {
  selectExchangeItemId,
  selectExchangeItemType,
  selectExchangeOwnCount,
  selectExchangePartnerCount,
  selectProductById,
  selectServiceById
} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';
import {createExchangeContract} from '../../actions/exchange';
import {shouldRefetchItem, isItemLoading} from '../../utils/refetch';
import Loader from '../../components/common/Loader/Loader';
import Confirmation from '../../components/Exchange/Confirmation';

const tryContractDeploy = ({
  selectedItem,
  selectedItemCount,
  partnerItem,
  partnerItemCount,
  createExchangeContract
}) => {
  if (
    !shouldRefetchItem(selectedItem) &&
    !shouldRefetchItem(partnerItem) &&
    !isItemLoading(selectedItem) &&
    !isItemLoading(partnerItem)
  ) {
    createExchangeContract({
      partnerItem,
      partnerItemCount,
      selectedItem,
      selectedItemCount
    });
  }
};

const mapStateToProps = (state, {partnerItemId, partnerItemType}) => {
  const selectedItemType = selectExchangeItemType(state);
  const selectedItemId = selectExchangeItemId(state);
  return {
    selectedItemId,
    selectedItemType,
    selectedItemCount: selectExchangeOwnCount(state),
    selectedItem:
      selectedItemType === 'product'
        ? selectProductById(state, selectedItemId)
        : selectServiceById(state, selectedItemId),

    partnerItemCount: selectExchangePartnerCount(state),
    partnerItem:
      partnerItemType === 'product'
        ? selectProductById(state, partnerItemId)
        : selectServiceById(state, partnerItemId)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchItem(type, id) {
    return dispatch(type === 'product' ? fetchProductById(id) : fetchServiceById(id));
  },
  createExchangeContract(...args) {
    return dispatch(createExchangeContract(...args));
  }
});

const refetch = ({
  selectedItem,
  selectedItemType,
  selectedItemId,
  partnerItem,
  partnerItemType,
  partnerItemId,
  fetchItem
}) => {
  if (shouldRefetchItem(selectedItem)) {
    fetchItem(selectedItemType, selectedItemId);
  }
  if (shouldRefetchItem(partnerItem)) {
    fetchItem(partnerItemType, partnerItemId);
  }
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      refetch(this.props);
      tryContractDeploy(this.props);
    },
    componentWillReceiveProps(nextProps) {
      refetch(nextProps);
    },
    componentDidUpdate() {
      tryContractDeploy(this.props);
    }
  }),
  withProps({
    state: 'waiting'
  })
)(props => {
  const content =
    isItemLoading(props.selectedItem) || isItemLoading(props.partnerItem) ? (
      <Loader />
    ) : (
      <Confirmation {...props} />
    );
  return <div className="exchange-step5">{content}</div>;
});
