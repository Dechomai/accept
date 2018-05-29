import './ExchangeOffer.scss';

import React from 'react';
import {Button} from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {omit} from 'ramda';

import Icon from '../common/Icon/Icon';
import UserLink from '../../components/common/UserLink/UserLink';
import ExchangeOfferItem from './ExchangeOfferItem';
import {formatPrice} from '../../utils/format';
import {calculateEscrow} from '../../utils/exchange';
import ExchangeAvailability from '../Exchange/ExchangeAvailability';

const HELPER_TEXT = {
  incoming:
    'By accepting this offer, I agree to the Accept.IO marketplace rules, and in the event of a transaction dispute, I agree to be bound by the Accept Star Council rules of arbitration and any decision made as a result of this arbitration process.',
  outcoming:
    'The seller can accept your offer, decline your offer, or make a counter-offer. If your offer is accepted by the seller, you and the seller are required to complete the transaction.',
  accepted: 'Please validate the transaction once it has been successfully completed.',

  validatedByCurrentUser:
    'Once the other party has validated this transaction, the smart contract funds will be released',
  validatedByOtherUser:
    'Once you have validated this transaction, the smart contract funds will be released.',
  reported:
    'This transaction has been escalated to the Accept Star Council for arbitration. Further updates will follow. Use the Accept Arbitration DApp to receive detailed up-to-date information.'
};

const getHelperText = (exchange, user) => {
  switch (exchange.status) {
    case 'new':
      return user.data.id === exchange.partner.id ? HELPER_TEXT.incoming : HELPER_TEXT.outcoming;
    case 'accepted':
      return HELPER_TEXT.accepted;
    case 'validatedByInitiator':
      return exchange.initiator.id === user.data.id
        ? HELPER_TEXT.validatedByCurrentUser
        : HELPER_TEXT.validatedByOtherUser;
    case 'validatedByPartner':
      return exchange.partner.id === user.data.id
        ? HELPER_TEXT.validatedByCurrentUser
        : HELPER_TEXT.validatedByOtherUser;
    case 'reportedByInitiator':
    case 'reportedByPartner':
      return HELPER_TEXT.reported;
    default:
      return null;
  }
};

const ExchangeOffer = ({
  exchange,
  user,
  showEscrow,
  showDetailsBtn,
  buttons = [],
  changeModalVisibility,
  status
}) => {
  const currentUserId = user.data.id;
  const helpText = getHelperText(exchange, user);
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
              itemType={exchange.initiatorItemType}
              quantity={exchange.initiatorItemQuantity}
            />
          </div>
          {exchange.initiatorItemType === 'service' && (
            <ExchangeAvailability
              className="exchange-offer__availability-section"
              days={exchange.initiatorItemDays}
              time={exchange.initiatorItemTime}
            />
          )}
        </div>

        <div className="exchange-offer__arrow">
          <Icon name="chevron-right" size="24" />
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
              itemType={exchange.partnerItemType}
              quantity={exchange.partnerItemQuantity}
            />
          </div>

          {exchange.partnerItemType === 'service' && (
            <ExchangeAvailability
              className="exchange-offer__availability-section"
              days={exchange.partnerItemDays}
              time={exchange.partnerItemTime}
              prefered
            />
          )}
        </div>
      </div>

      {/* Show Escrow */}
      {showEscrow && (
        <div className="exchange-offer__escrow-wrapper">
          <div className="row">
            <div className="col-6">
              <p className="exchange-offer__hint">
                The value of your exchange will be deducted from your Accept wallet and escrowed in
                the transaction’s smart contract wallet {exchange.bcContractAddress}.
              </p>
            </div>
            <div className="col-6">
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
      <div className="exchange-offer__footer">
        {helpText && (
          <div className="exchange-offer__info-alert">
            <Icon size="20" name="information-outline" />
            <div className="exchange-offer__info-alert__text">{helpText}</div>
          </div>
        )}
        <div className="exchange-offer__actions">
          {showDetailsBtn && (
            <Button color="link" size="sm" onClick={changeModalVisibility}>
              View Details
            </Button>
          )}
          {buttons
            .filter(({visible}) => !visible || visible(exchange, user))
            .map(({title, color, onClick, ...rest}) => (
              <Button
                key={title}
                color={color || 'primary'}
                size="sm"
                onClick={() => onClick(exchange)}
                {...omit(['visible'], rest)}>
                {title}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

ExchangeOffer.propTypes = {
  exchange: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      color: PropTypes.string
    })
  ),
  changeModalVisibility: PropTypes.func,
  showDetailsBtn: PropTypes.bool,
  showEscrow: PropTypes.bool,
  status: PropTypes.object
};

ExchangeOffer.defaultProps = {
  showDetailsBtn: true,
  showEscrow: true
};

export default ExchangeOffer;
