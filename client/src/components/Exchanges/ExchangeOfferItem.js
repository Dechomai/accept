import './ExchangeOfferItem.scss';

import React from 'react';
import PropTypes from 'prop-types';

import {getPrimaryImage, getImageThumbnail} from '../../utils/img';
import {formatPrice} from '../../utils/format';

const ExchangeOfferItem = ({item, itemType, quantity}) => {
  const primaryImgUrl = getPrimaryImage(item);
  const imgUrl = primaryImgUrl ? getImageThumbnail(primaryImgUrl) : '/assets/img/placeholder.png';

  return (
    <div className="exchange-offer-item">
      <div className="exchange-offer-item__info">
        <div className="exchange-offer-item__photo" style={{backgroundImage: `url(${imgUrl})`}} />
        <h6 className="exchange-offer-item__name">{item.title}</h6>
      </div>

      <div className="exchange-offer-item__conditions">
        <div className="exchange-offer-item__details">
          <span className="exchange-offer-item__details__name">Quantity</span>
          <span className="exchange-offer-item__details__count">{quantity}</span>
        </div>
        <div className="exchange-offer-item__details">
          <span className="exchange-offer-item__details__name">
            {itemType === 'product' ? 'Price/Item' : 'Price/Hour'}
          </span>
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
  );
};

ExchangeOfferItem.propTypes = {
  item: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired
};

export default ExchangeOfferItem;
