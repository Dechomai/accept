import './Step6.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle, withProps} from 'recompact';

import {
  selectExchangeItemId,
  selectExchangeItemType,
  selectExchangeOwnCount,
  selectExchangeOwnDays,
  selectExchangeOwnTime,
  selectExchangePartnerCount,
  selectExchangePartnerDays,
  selectExchangePartnerTime,
  selectProductById,
  selectServiceById
} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';
import {createExchangeContract} from '../../actions/exchange';
import {shouldRefetchItem, isItemLoading} from '../../utils/refetch';
import Loader from '../../components/common/Loader/Loader';
import Confirmation from '../../components/Exchange/Confirmation';
import withDataEnsurance from '../../hoc/exchange/withDataEnsurance';

const tryContractDeploy = ({
  selectedItem,
  selectedItemType,
  selectedItemCount,
  selectedItemDays,
  selectedItemTime,
  partnerItem,
  partnerItemType,
  partnerItemCount,
  partnerItemDays,
  partnerItemTime,
  createExchangeContract,

  onComplete
}) => {
  if (
    !shouldRefetchItem(selectedItem) &&
    !shouldRefetchItem(partnerItem) &&
    !isItemLoading(selectedItem) &&
    !isItemLoading(partnerItem)
  ) {
    createExchangeContract({
      partnerItem,
      partnerItemType,
      partnerItemCount,
      partnerItemDays,
      partnerItemTime,
      selectedItem,
      selectedItemType,
      selectedItemCount,
      selectedItemDays,
      selectedItemTime
    }).then(
      () => onComplete('accepted'),
      err => onComplete(err === 'rejected' ? 'rejected' : 'error')
    );
  }
};

const mapStateToProps = (state, {partnerItemId, partnerItemType}) => {
  const selectedItemType = selectExchangeItemType(state);
  const selectedItemId = selectExchangeItemId(state);
  const selectedItemCount = selectExchangeOwnCount(state);
  const selectedItemDays = selectExchangeOwnDays(state);
  const selectedItemTime = selectExchangeOwnTime(state);
  const partnerItemCount = selectExchangePartnerCount(state);
  const partnerItemDays = selectExchangePartnerDays(state);
  const partnerItemTime = selectExchangePartnerTime(state);

  return {
    selectedItemId,
    selectedItemType,
    selectedItemCount,
    selectedItemDays,
    selectedItemTime,
    selectedItem:
      selectedItemType === 'product'
        ? selectProductById(state, selectedItemId)
        : selectServiceById(state, selectedItemId),

    partnerItemCount,
    partnerItemDays,
    partnerItemTime,
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
  withDataEnsurance([
    'initiatorItemType',
    'initiatorItemId',
    'initiatorItemCount',
    'initiatorItemDays',
    'initiatorItemTime',
    'partnerItemType',
    'partnerItemId',
    'partnerItemCount',
    'partnerItemDays',
    'partnerItemTime'
  ]),
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
  return <div className="exchange-step6">{content}</div>;
});
