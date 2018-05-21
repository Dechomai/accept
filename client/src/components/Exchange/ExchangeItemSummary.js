import './ExchangeItemSummary.scss';

import React from 'react';
import classNames from 'classnames';

import {getPrimaryImage, getImageThumbnail} from '../../utils/img';
import UserLink from '../../components/common/UserLink/UserLink';

const ExchangeItemSummary = ({title, item, type, count, isOwner, days, time}) => {
  const primaryImageUrl = getPrimaryImage(item);
  const imgUrl = primaryImageUrl
    ? getImageThumbnail(primaryImageUrl)
    : '/assets/img/placeholder.png';
  const total = item.price * count;

  return (
    <div
      className={classNames('exchange-item-summary', {
        'exchange-item-summary--wanted-item': !isOwner
      })}>
      <div className="exchange-item-summary__header">{title}</div>
      <div className="exchange-item-summary__owner">
        <UserLink user={item.createdBy} isOwner={isOwner} />
      </div>
      <div className="exchange-item-summary__item">
        <div className="row d-flex align-items-center justify-content-start">
          <div className="col-3">
            <div
              className="exchange-item-summary__photo"
              style={{backgroundImage: `url(${imgUrl})`}}
            />
          </div>
          <div className="col-9 exchange-item-summary__title">{item.title}</div>
        </div>
        <div className="row">
          <div className="col-9 offset-3 exchange-item-summary__properties">
            <div className="exchange-item-summary__quantity">
              <div className="exchange-item-summary__label">
                {type === 'product' ? 'Quantity' : 'Hours'}
              </div>
              <div className="exchange-item-summary__value">{count}</div>
            </div>
            <div className="exchange-item-summary__price">
              <div className="exchange-item-summary__label">
                Price/{type === 'product' ? 'Item' : 'Hour'}
              </div>
              <div className="exchange-item-summary__value">{item.price.toFixed(2)}</div>
            </div>
            <div className="exchange-item-summary__total">
              <div className="exchange-item-summary__label">Total</div>
              <div className="exchange-item-summary__value">{total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      {type === 'service' &&
        days.length > 0 &&
        time.length > 0 && (
          <div className="exchange-item-summary__availability">
            Availability: <strong>{days.join(', ')}</strong> in the{' '}
            <strong>{time.join(', ')}</strong>
          </div>
        )}
    </div>
  );
};

ExchangeItemSummary.defaultProps = {
  days: [],
  time: []
};

export default ExchangeItemSummary;
