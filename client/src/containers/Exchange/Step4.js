import './Step4.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompact';
import {withRouter} from 'react-router';
import {selectProductById, selectServiceById} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';
import {getPrimaryImage, getImageThumbnail} from '../../utils/img';

import UserLink from '../../components/common/UserLink/UserLink';
import Icon from '../../components/common/Icon/Icon';
import ExchangeEscrow from '../../components/Exchange/Escrow';

const ItemSummary = ({title, item, type, count, isOwner, days, time}) => {
  const primaryImageUrl = getPrimaryImage(item);
  const imgUrl = primaryImageUrl
    ? getImageThumbnail(primaryImageUrl)
    : '/assets/img/placeholder.png';
  const total = item.price * count;

  return (
    <div className="item-summary">
      <div className="item-summary__header">{title}</div>
      <div className="item-summary__owner">
        <UserLink user={item.createdBy} isOwner={isOwner} />
      </div>
      <div className="item-summary__item">
        <div className="row d-flex align-items-center justify-content-start">
          <div className="col-3">
            <div className="item-summary__photo" style={{backgroundImage: `url(${imgUrl})`}} />
          </div>
          <div className="col-9 item-summary__title">{item.title}</div>
        </div>
        <div className="row">
          <div className="col-9 offset-3 item-summary__properties">
            <div className="item-summary__quantity">
              <div className="item-summary__label">{type === 'product' ? 'Quantity' : 'Hours'}</div>
              <div className="item-summary__value">{count}</div>
            </div>
            <div className="item-summary__price">
              <div className="item-summary__label">
                Price/{type === 'product' ? 'Item' : 'Hour'}
              </div>
              <div className="item-summary__value">{item.price.toFixed(2)}</div>
            </div>
            <div className="item-summary__total">
              <div className="item-summary__label">Total</div>
              <div className="item-summary__value">{total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      {type === 'service' &&
        days.length > 0 &&
        time.length > 0 && (
          <div className="item-summary__availability">
            Availability: <strong>{days.join(', ')}</strong> in the{' '}
            <strong>{time.join(', ')}</strong>
          </div>
        )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    ownItem:
      ownProps.ownType === 'product'
        ? selectProductById(state, ownProps.ownItemId)
        : selectServiceById(state, ownProps.ownItemId)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchItem() {
      return dispatch(
        ownProps.ownType === 'product'
          ? fetchProductById(ownProps.ownItemId)
          : fetchServiceById(ownProps.ownItemId)
      );
    }
  };
};

const refetchItem = props => {
  const {ownItem, fetchItem} = props;

  if (!ownItem || (ownItem.error && !ownItem.loading)) {
    fetchItem();
  }
};

export default compose(
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
    ownType,
    ownCount,
    ownDays,
    ownTime,
    wantedItem,
    wantedType,
    wantedCount,
    difference,
    escrow
  }) => {
    return ownItem && !ownItem.loading && !ownItem.error ? (
      <div className="exchange-step4">
        <div className="exchange-step4__sections">
          <div className="exchange-step4__section">
            <ItemSummary
              title="Your offer:"
              item={ownItem.data}
              type={ownType}
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
                Your <strong>escrowed funds will be returned</strong>
                to your Accept wallet <strong>after both parties validate</strong> that the
                transaction has successfully completed, and feedback has been provided.
              </p>
              <p>
                If either buyer or seller
                <strong>does not the validate the transaction</strong>, a transaction dispute will
                be initiated, and the funds will remain in escrow pending the decision of an Accept
                Star Council.
              </p>
            </div>
          </div>
          <Icon className="exchange-step4__arrow" name="chevron-right" />
          <div className="exchange-step4__section">
            <ItemSummary
              title="Item for exchange:"
              item={wantedItem}
              type={wantedType}
              count={wantedCount}
              days={[]}
              time={[]}
            />
            <ExchangeEscrow difference={difference} escrow={escrow} />
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
    ) : null;
  }
);
