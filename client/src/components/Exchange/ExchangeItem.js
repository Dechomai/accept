import './ExchangeItem.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobindr';
import {Input} from 'reactstrap';
import {ifElse, contains, append, without} from 'ramda';

import {getPrimaryImage, getImageThumbnail} from '../../utils/img';
import {formatPrice} from '../../utils/format';
import {Days, Time} from '../../constants/exchange';

const toggleElement = element => ifElse(contains(element), without([element]), append(element));

class ExchangeItem extends React.Component {
  constructor() {
    super();
    autobind(this);
  }

  handleQuantityChange(e) {
    const {value} = e.target;

    const num = parseInt(+value);
    if (!value || (!isNaN(num) && num >= 1 && num < 200000)) {
      this.props.onQuantityChange(num || '');
    }
  }

  toggleDay(day) {
    if (this.props.own) {
      this.props.onOwnDaysChange(toggleElement(day)(this.props.days));
    } else {
      this.props.onPartnerDaysChange(toggleElement(day)(this.props.partnerDays));
    }
  }

  toggleTime(time) {
    if (this.props.own) {
      this.props.onOwnTimeChange(toggleElement(time)(this.props.time));
    } else {
      this.props.onPartnerTimeChange(toggleElement(time)(this.props.partnerTime));
    }
  }

  render() {
    const {type, className, title, days, time: dayTime, partnerDays, partnerTime, own} = this.props;
    const item = this.props.item;

    const primaryImageUrl = getPrimaryImage(item);
    const imgUrl = primaryImageUrl
      ? getImageThumbnail(primaryImageUrl)
      : '/assets/img/placeholder.png';

    return (
      <div className={classNames(className, 'exchange-item')}>
        <h6 className="exchange-item__header">{title}</h6>
        <div className="exchange-item__wrapper">
          <div className="exchange-item__info">
            <div
              className="exchange-item__info__image"
              style={{backgroundImage: `url(${imgUrl})`}}
            />
            <div className="exchange-item__info__title">{item.title}</div>
          </div>
          <div className="exchange-item__quantity">
            <div className="exchange-item__label">{type === 'product' ? 'Quantity' : 'Hours'}</div>
            <div className="exchange-item__quantity__input-wrapper">
              <Input
                className={classNames('exchange-item__quantity__input', {
                  'is-invalid': !this.props.quantity
                })}
                type="text"
                value={this.props.quantity}
                onChange={this.handleQuantityChange}
              />
            </div>
          </div>
          <div className="exchange-item__price">
            <div className="exchange-item__price__single">
              <div className="exchange-item__label">
                {type === 'product' ? 'Price/Item' : 'Price/Hour'}
              </div>
              <div className="exchange-item__price__value">{formatPrice(item.price)}</div>
            </div>
            <div className="exchange-item__price__total">
              <div className="exchange-item__label">Total</div>
              <div className="exchange-item__price__value">
                {formatPrice(item.price * this.props.quantity)}
              </div>
            </div>
          </div>

          {type === 'service' && (
            <div className="exchange-item__availability">
              <div className={own ? 'weekdays__title' : 'exchange-item__label'}>Weekdays:</div>
              {own && (
                <div className="weekdays__description">
                  Choose the weekdays when the service can be provided
                </div>
              )}
              <div className="weekdays__container">
                {Days.map((day, index) => (
                  <div
                    key={index}
                    className={classNames('weekdays__item', {
                      'weekdays__item--active': own
                        ? days.includes(index)
                        : partnerDays.includes(index)
                    })}
                    onClick={() => this.toggleDay(index)}>
                    {day}
                  </div>
                ))}
              </div>
              <div className={own ? 'daytime__title' : 'exchange-item__label'}>Available time:</div>
              {own && (
                <div className="daytime__description">
                  Pick the time of the day to provide the service
                </div>
              )}
              <div className="daytime__container">
                {Time.map((time, index) => (
                  <div
                    key={index}
                    className={classNames('daytime__item', {
                      'daytime__item--active': own
                        ? dayTime.includes(index)
                        : partnerTime.includes(index)
                    })}
                    onClick={() => this.toggleTime(index)}>
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

ExchangeItem.propTypes = {
  item: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['product', 'service']).isRequired,
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string,
  days: PropTypes.arrayOf(PropTypes.number),
  time: PropTypes.arrayOf(PropTypes.number),
  partnerDays: PropTypes.arrayOf(PropTypes.number),
  partnerTime: PropTypes.arrayOf(PropTypes.number),
  own: PropTypes.bool,
  className: PropTypes.string,
  onQuantityChange: PropTypes.func.isRequired,
  onOwnDaysChange: PropTypes.func,
  onOwnTimeChange: PropTypes.func,
  onPartnerDaysChange: PropTypes.func,
  onPartnerTimeChange: PropTypes.func
};

ExchangeItem.defaultProps = {
  className: '',
  title: 'Item for exchange',
  days: [],
  time: [],
  partnerDays: [],
  partnerTime: []
};

export default ExchangeItem;
