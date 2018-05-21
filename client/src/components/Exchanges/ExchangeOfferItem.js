import './ExchangeOfferItem.scss';

import React from 'react';
import PropTypes from 'prop-types';

import {getPrimaryImage, getImageThumbnail} from '../../utils/img';
import {formatPrice} from '../../utils/format';

const ExchangeOfferItem = ({item, quantity}) => {
  const primaryImgUrl = getPrimaryImage(item);
  const imgUrl = primaryImgUrl ? getImageThumbnail(primaryImgUrl) : '/assets/img/placeholder.png';

  return (
    <div className="exchange-offer-item">
      <div className="row">
        <div className="col-3">
          <div className="exchange-offer-item__photo" style={{backgroundImage: `url(${imgUrl})`}} />
        </div>
        <div className="col-9">
          <div className="exchange-offer-item__wrapper">
            <h6 className="exchange-offer-item__name">{item.title}</h6>
            <div className="exchange-offer-item__details">
              <span className="exchange-offer-item__details__name">Quantity</span>
              <span className="exchange-offer-item__details__count">{quantity}</span>
            </div>
            <div className="exchange-offer-item__details">
              <span className="exchange-offer-item__details__name">Price/Item</span>
              <span className="exchange-offer-item__details__count">{formatPrice(item.price)}</span>
            </div>
            <div className="exchange-offer-item__details">
              <span className="exchange-offer-item__details__name">Total</span>
              <span className="exchange-offer-item__details__count exchange-offer-item__details__count--total">
                {formatPrice(item.price * quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ExchangeOfferItem.propTypes = {
  item: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired
};

export default ExchangeOfferItem;
