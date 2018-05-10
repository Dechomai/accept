import './Escrow.scss';

import React from 'react';
import PropTypes from 'prop-types';

import {formatPrice} from '../../utils/format';

const ExchangeEscrow = ({difference, escrow}) => {
  return (
    <div className="exchange-escrow">
      <div className="exchange-escrow__difference">
        <div className="exchange-escrow__label">Difference: </div>
        <div className="exchange-escrow__value">{formatPrice(difference)}</div>
      </div>
      <div className="exchange-escrow__escrow">
        <div className="exchange-escrow__label">Escrow: </div>
        <div className="exchange-escrow__value">{formatPrice(escrow)}</div>
      </div>
    </div>
  );
};

ExchangeEscrow.propTypes = {
  difference: PropTypes.number.isRequired,
  escrow: PropTypes.number.isRequired
};

export default ExchangeEscrow;
