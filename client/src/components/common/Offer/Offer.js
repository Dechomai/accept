import './offer.scss';

import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import classNames from 'classnames';

class Offer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {title, price, currency, per, imageUrl, className} = this.props;

    return (
      <div className={classNames('offer', className || '')}>
        <img className="offer__image" src={imageUrl} />
        <div className="offer__price">
          <span className="offer__price__value">{`${currency} ${price.toFixed(2)}`}</span>
          {per && <span className="offer__price__per">{`/ ${per}`}</span>}
        </div>
        <Text className="offer__title" maxCharacters={40}>
          {title}
        </Text>
      </div>
    );
  }
}

Offer.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  per: PropTypes.oneOf(['hour'])
};

export default Offer;
