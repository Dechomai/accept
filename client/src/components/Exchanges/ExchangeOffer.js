import './ExchangeOffer.scss';

import React from 'react';
import {Button} from 'reactstrap';
import UserLink from '../../components/common/UserLink/UserLink';
import PropTypes from 'prop-types';
import Icon from '../common/Icon/Icon';

import ExchangeOfferItem from './ExchangeOfferItem';

const ExchangeOffer = () => {
  return (
    <div className="exchange-offer">
      <div className="exchange-offer__items-wrapper">
        <div className="exchange-offer__section exchange-offer__section--is-owner">
          <div className="exchange-offer__user-section">
            <UserLink
              user={{firstName: 'Mr.Big', lastName: 'Huge', username: 'Hugo'}}
              isOwner={true}
            />
          </div>
          <div className="exchange-offer__item-section">
            <ExchangeOfferItem isOwner={true} />
          </div>
        </div>
        <div className="exchange-offer__section exchange-offer__section--is-partner">
          <div className="exchange-offer__user-section">
            <UserLink
              user={{firstName: 'Mr.Big', lastName: 'Huge', username: 'Hugo'}}
              isOwner={false}
            />
            <div className="exchange-offer__status">accepted</div>
          </div>
          <div className="exchange-offer__item-section">
            <ExchangeOfferItem isOwner={false} />
          </div>
        </div>
      </div>
      <div className="container exchange-offer__escrow-wrapper">
        <div className="row">
          <div className="col-7">
            <p className="exchange-offer__hint">
              The value of your exchange will be deducted from your Accept wallet and escrowed in
              the transaction’s smart contract wallet [Public key].
            </p>
          </div>
          <div className="col-5">
            <div className="exchange-offer__escrow">
              <span className="exchange-offer__escrow__label">Escrow</span>
              <span className="exchange-offer__escrow__count">29.00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-7">
            <div className="exchange-offer__info-alert">
              <Icon size="20" name="information-outline" />
              <div className="exchange-offer__info-alert__text">
                By accepting this offer, I agree to the Accept.IO marketplace rules, and in the
                event of a transaction dispute, I agree to be bound by the Accept Star Council rules
                of arbitration and any decision made as a result of this arbitration process.
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="exchange-offer__actions">
              <Button color="link" size="sm">
                View Details
              </Button>
              <Button color="danger" size="sm">
                Reject
              </Button>
              <Button color="primary" size="sm">
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ExchangeOffer.propTypes = {
  isOwner: PropTypes.bool.isRequired
};

export default ExchangeOffer;
