import './ExchangeItem.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobindr';
import {Input} from 'reactstrap';

import {getPrimaryImage, getImageThumbnail} from '../../utils/img';
import {formatPrice} from '../../utils/format';

class ExchangeItem extends React.Component {
  constructor() {
    super();
    this.state = {
      quantity: 1,
      activeDays: [],
      activeTime: []
    };
    autobind(this);
  }

  handleQuantityChange(e) {
    const {value} = e.target;

    const num = parseInt(+value);
    if (!value || (!isNaN(num) && num >= 1 && num < 200000)) {
      this.setState({quantity: num || ''});
    }
  }

  toggleDay(day) {
    const {activeDays} = this.state;
    const index = activeDays.indexOf(day);
    if (index > -1) {
      activeDays.splice(index, 1);
    } else {
      activeDays.push(day);
    }

    this.setState({activeDays});
  }

  toggleTime(time) {
    const {activeTime} = this.state;
    const index = activeTime.indexOf(time);
    if (index > -1) {
      activeTime.splice(index, 1);
    } else {
      activeTime.push(time);
    }

    this.setState({activeTime});
  }

  render() {
    const {item, type, className, title, own} = this.props;
    const {activeDays, activeTime} = this.state;

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
                  'is-invalid': !this.state.quantity
                })}
                type="text"
                value={this.state.quantity}
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
                {formatPrice(item.price * this.state.quantity)}
              </div>
            </div>
          </div>

          {own &&
            type === 'service' && (
              <div className="exchange-item__availability">
                <div className="weekdays__title">Weekdays:</div>
                <div className="weekdays__description">
                  Choose the weekdays when the service can be provided
                </div>
                <div className="weekdays__container">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div
                      key={day}
                      className={classNames('weekdays__item', {
                        'weekdays__item--active': activeDays.includes(day)
                      })}
                      onClick={() => this.toggleDay(day)}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="daytime__title">Available time:</div>
                <div className="daytime__description">
                  Pick the time of the day to provide the service
                </div>
                <div className="daytime__container">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                    <div
                      key={time}
                      className={classNames('daytime__item', {
                        'daytime__item--active': activeTime.includes(time)
                      })}
                      onClick={() => this.toggleTime(time)}>
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
  title: PropTypes.string,
  own: PropTypes.bool,
  className: PropTypes.string
};

ExchangeItem.defaultProps = {
  className: '',
  title: 'Item for exchange'
};

export default ExchangeItem;
