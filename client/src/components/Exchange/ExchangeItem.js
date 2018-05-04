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
      quantity: 1
    };
    autobind(this);
  }
  handleQuantityChange(e) {
    const {value} = e.target;

    const num = +value;
    if (!value || (!isNaN(num) && num >= 1 && num < 200000)) {
      this.setState({quantity: value});
    }
  }

  render() {
    const {className, item} = this.props;
    console.log(item);
    const primaryImageUrl = getPrimaryImage(item);
    const imgUrl = primaryImageUrl
      ? getImageThumbnail(primaryImageUrl)
      : '/assets/img/placeholder.png';

    return (
      <div className={classNames(className, 'exchange-item')}>
        <h6 className="exchange-item__header">Item for exchange</h6>
        <div className="exchange-item__info">
          <div className="exchange-item__info__image" style={{backgroundImage: `url(${imgUrl})`}} />
          <div className="exchange-item__info__title">{item.title}</div>
        </div>
        <div className="exchange-item__quantity">
          <div className="exchange-item__label">Quantity</div>
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
            <div className="exchange-item__label">Price/Item</div>
            <div className="exchange-item__price__value">{formatPrice(item.price)}</div>
          </div>
          <div className="exchange-item__price__total">
            <div className="exchange-item__label">Total</div>
            <div className="exchange-item__price__value">
              {formatPrice(item.price * this.state.quantity)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExchangeItem.propTypes = {
  className: PropTypes.string,
  item: PropTypes.any.isRequired
};

ExchangeItem.defaultProps = {
  className: ''
};

export default ExchangeItem;
