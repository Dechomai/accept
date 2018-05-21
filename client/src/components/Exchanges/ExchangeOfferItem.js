import './ExchangeOfferItem.scss';

import React from 'react';
import classNames from 'classnames';

const ExchangeOfferItem = ({isOwner}) => {
  return (
    <div
      className={classNames('exchange-offer-item', {
        'exchange-offer-item--is-owner': isOwner,
        'exchange-offer-item--is-partner': !isOwner
      })}>
      <div className="row">
        <div className="col-3">
          <div
            className="exchange-offer-item__photo"
            style={{backgroundImage: `url('/assets/img/acc-connection.png')`}}
          />
        </div>
        <div className="col-9">
          <div className="exchange-offer-item__wrapper">
            <h6 className="exchange-offer-item__name">
              220V 7 Speed Electric Stand Mixer Hand Countertop Kitchen Homemade Cakes Muffins
            </h6>
            <div className="exchange-offer-item__details">
              <span className="exchange-offer-item__details__name">Quantity</span>
              <span className="exchange-offer-item__details__count">1</span>
            </div>
            <div className="exchange-offer-item__details">
              <span className="exchange-offer-item__details__name">Price/Item</span>
              <span className="exchange-offer-item__details__count">29.00</span>
            </div>
            <div className="exchange-offer-item__details">
              <span className="exchange-offer-item__details__name">Total</span>
              <span className="exchange-offer-item__details__count exchange-offer-item__details__count--total">
                30.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeOfferItem;
