import './Step5.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle, withProps} from 'recompact';
import {all, identity} from 'ramda';

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
import withDataEnsurance from '../../hoc/exchange/withDataEnsurance';

const tryContractDeploy = ({
  selectedItem,
  selectedItemType,
  selectedItemCount,
  partnerItem,
  partnerItemType,
  partnerItemCount,
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
      selectedItem,
      selectedItemType,
      selectedItemCount
    }).then(() => onComplete('accepted'), err => onComplete(err || 'error'));
  }
};

const mapStateToProps = (state, {partnerItemId, partnerItemType}) => {
  const selectedItemType = selectExchangeItemType(state);
  const selectedItemId = selectExchangeItemId(state);
  const selectedItemCount = selectExchangeOwnCount(state);
  const partnerItemCount = selectExchangePartnerCount(state);

  return all(identity, [
    selectedItemType,
    selectedItemId,
    selectedItemCount,
    partnerItemType,
    partnerItemId,
    partnerItemCount
  ])
    ? {
        selectedItemId,
        selectedItemType,
        selectedItemCount,
        selectedItem:
          selectedItemType === 'product'
            ? selectProductById(state, selectedItemId)
            : selectServiceById(state, selectedItemId),

        partnerItemCount,
        partnerItem:
          partnerItemType === 'product'
            ? selectProductById(state, partnerItemId)
            : selectServiceById(state, partnerItemId)
      }
    : {dataAbsent: true};
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
  if (!this.props.dataAbsent && shouldRefetchItem(selectedItem)) {
    fetchItem(selectedItemType, selectedItemId);
  }
  if (!this.props.dataAbsent && shouldRefetchItem(partnerItem)) {
    fetchItem(partnerItemType, partnerItemId);
  }
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDataEnsurance(),
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
