import './ExchangeOffer.scss';

import React from 'react';
import {Button} from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from '../common/Icon/Icon';
import UserLink from '../../components/common/UserLink/UserLink';
import ExchangeOfferItem from './ExchangeOfferItem';
import {formatPrice} from '../../utils/format';
import {calculateEscrow} from '../../utils/exchange';

const HELPER_TEXT = {
  incoming:
    'By accepting this offer, I agree to the Accept.IO marketplace rules, and in the event of a transaction dispute, I agree to be bound by the Accept Star Council rules of arbitration and any decision made as a result of this arbitration process.',
  outcoming:
    'The seller can accept your offer, decline your offer, or make a counter-offer. If your offer is accepted by the seller, you and the seller are required to complete the transaction.',
  pending: '',
  reported:
    'This transaction has been escalated to the Accept Star Council for arbitration. Further updates will follow. Use the Accept Arbitration DApp to receive detailed up-to-date information.'
};

const getStatus = (exchange, user) => {
  if (exchange.status === 'new' && user.data.id === exchange.initiator.id)
    return {title: 'Offer Sent', modifier: 'offer-sent'};
  return {title: '', modifier: ''};
};

const ExchangeOffer = ({exchange, user, type, showEscrow, showDetailsBtn, buttons}) => {
  const currentUserId = user.data.id;
  const status = getStatus(exchange, user);
  return (
    <div className="exchange-offer">
      <div className="exchange-offer__items-wrapper">
        {/* Initiator */}
        <div className="exchange-offer__section exchange-offer__section--initiator">
          <div className="exchange-offer__user-section">
            <UserLink user={exchange.initiator} isOwner={exchange.initiator.id === currentUserId} />
          </div>
          <div className="exchange-offer__item-section">
            <ExchangeOfferItem
              item={exchange.initiatorItem}
              quantity={exchange.initiatorItemQuantity}
            />
          </div>
        </div>

        {/* Partner */}
        <div className="exchange-offer__section exchange-offer__section--partner">
          <div className="exchange-offer__user-section">
            <UserLink user={exchange.partner} isOwner={exchange.partner.id === currentUserId} />
            <div
              className={classNames('exchange-offer__status', {
                [`exchange-offer__status--${status.modifier}`]: status.modifier
              })}>
              {status.title}
            </div>
          </div>
          <div className="exchange-offer__item-section">
            <ExchangeOfferItem
              item={exchange.partnerItem}
              quantity={exchange.partnerItemQuantity}
            />
          </div>
        </div>
      </div>

      {/* Show Escrow */}
      {showEscrow && (
        <div className="container exchange-offer__escrow-wrapper">
          <div className="row">
            <div className="col-7">
              <p className="exchange-offer__hint">
                The value of your exchange will be deducted from your Accept wallet and escrowed in
                the transaction’s smart contract wallet {exchange.bcContractAddress}.
              </p>
            </div>
            <div className="col-5">
              <div className="exchange-offer__escrow">
                <span className="exchange-offer__escrow__label">Escrow</span>
                <span className="exchange-offer__escrow__count">
                  {formatPrice(
                    calculateEscrow(
                      exchange.initiatorItem.price,
                      exchange.initiatorItemQuantity,
                      exchange.partnerItem.price,
                      exchange.partnerItemQuantity
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helper Text and Action Buttons */}
      <div className="container">
        <div className="row">
          <div className="col-7">
            <div className="exchange-offer__info-alert">
              <Icon size="20" name="information-outline" />
              <div className="exchange-offer__info-alert__text">{HELPER_TEXT[type]}</div>
            </div>
          </div>
          <div className="col-5">
            <div className="exchange-offer__actions">
              {showDetailsBtn && (
                <Button color="link" size="sm" disabled>
                  View Details
                </Button>
              )}
              {buttons.map(({title, color, onClick, ...rest}) => (
                <Button
                  key={title}
                  color={color || 'primary'}
                  size="sm"
                  onClick={onClick}
                  {...rest}>
                  {title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ExchangeOffer.propTypes = {
  exchange: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['incoming', 'outcoming', 'pending', 'rejected', 'archive']).isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      color: PropTypes.string
    })
  ).isRequired,
  showDetailsBtn: PropTypes.bool,
  showEscrow: PropTypes.bool
};

ExchangeOffer.defaultProps = {
  showDetailsBtn: true,
  showEscrow: true
};

export default ExchangeOffer;
