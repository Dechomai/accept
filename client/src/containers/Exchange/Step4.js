import './Step4.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompact';
import {withRouter} from 'react-router';
import {selectProductById, selectServiceById} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';

import Icon from '../../components/common/Icon/Icon';
import Loader from '../../components/common/Loader/Loader';
import ExchangeItemSummary from '../../components/Exchange/ExchangeItemSummary';
import ExchangeEscrow from '../../components/Exchange/Escrow';
import {shouldRefetchItem, isItemLoading} from '../../utils/refetch';
import withDataEnsurance from '../../hoc/exchange/withDataEnsurance';

const mapStateToProps = (state, {ownItemId, ownItemType, partnerItemId, partnerItemType}) => ({
  ownItem:
    ownItemType === 'product'
      ? selectProductById(state, ownItemId)
      : selectServiceById(state, ownItemId),

  partnerItem:
    partnerItemType === 'product'
      ? selectProductById(state, partnerItemId)
      : selectServiceById(state, partnerItemId)
});

const mapDispatchToProps = dispatch => {
  return {
    fetchItem(type, id) {
      return dispatch(type === 'product' ? fetchProductById(id) : fetchServiceById(id));
    }
  };
};

const refetchItem = ({
  ownItem,
  ownItemId,
  ownItemType,
  partnerItem,
  partnerItemId,
  partnerItemType,
  fetchItem
}) => {
  if (shouldRefetchItem(ownItem)) {
    fetchItem(ownItemType, ownItemId);
  }
  if (shouldRefetchItem(partnerItem)) {
    fetchItem(partnerItemType, partnerItemId);
  }
};

export default compose(
  withDataEnsurance(['ownItemId', 'ownItemType', 'partnerItemId', 'partnerItemType']),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      refetchItem(this.props);
    },
    // TODO: Replace in React v17 with:
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      refetchItem(nextProps);
    }
  })
)(
  ({
    ownItem,
    ownItemType,
    ownCount,
    ownDays,
    ownTime,
    partnerDays,
    partnerTime,
    partnerItem,
    partnerItemType,
    partnerCount,
    calculateEscrowDifference,
    calculateEscrow
  }) => {
    if (isItemLoading(ownItem) || isItemLoading(partnerItem)) {
      return (
        <div className="exchange-step4">
          <Loader />
        </div>
      );
    }
    return (
      <div className="exchange-step4">
        <div className="exchange-step4__sections">
          <div className="exchange-step4__section">
            <ExchangeItemSummary
              title="Your offer:"
              item={ownItem.data}
              type={ownItemType}
              count={ownCount}
              days={ownDays}
              time={ownTime}
              isOwner
            />
            <div className="exchange-step4__transaction-info">
              <p>
                <strong>
                  The value of your exchange will be deducted from your Accept wallet and escrowed
                  in the transaction’s smart contract wallet
                </strong>{' '}
                [Public key].
              </p>
              <p>
                If there is a difference in listing values between the items being exchanged,{' '}
                <strong>the lowest amount will be set as the transaction value</strong>, and will be
                escrowed by both parties.
              </p>
              <p>
                Your <strong>escrowed funds will be returned</strong> to your Accept wallet{' '}
                <strong>after both parties validate</strong> that the transaction has successfully
                completed, and feedback has been provided.
              </p>
              <p>
                If either buyer or seller <strong>does not the validate the transaction</strong>, a
                transaction dispute will be initiated, and the funds will remain in escrow pending
                the decision of an Accept Star Council.
              </p>
            </div>
          </div>
          <Icon className="exchange-step4__arrow" name="chevron-right" />
          <div className="exchange-step4__section">
            <ExchangeItemSummary
              title="Item for exchange:"
              item={partnerItem.data}
              type={partnerItemType}
              count={partnerCount}
              days={partnerDays}
              time={partnerTime}
            />
            <ExchangeEscrow difference={calculateEscrowDifference()} escrow={calculateEscrow()} />
          </div>
        </div>
        <div className="exchange-step4__disclaimer">
          <Icon className="exchange-step4__disclaimer__icon" name="information-outline" />
          <span>
            By accepting this offer, I agree to the Accept.IO marketplace rules, and in the event of
            a transaction dispute, I agree to be bound by the Accept Star Council rules of
            arbitration and any decision made as a result of this arbitration process.
          </span>
        </div>
      </div>
    );
  }
);
