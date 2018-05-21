import React from 'react';
import PropTypes from 'prop-types';

import ExchangeOffer from './ExchangeOffer';

const ExchangesList = ({exchanges, title, ...props}) => (
  <div className="exchanges-list">
    <h5 className="mb-4">{title}</h5>
    {exchanges.map(exchange => <ExchangeOffer key={exchange.id} exchange={exchange} {...props} />)}
  </div>
);

ExchangesList.propTypes = {
  exchanges: PropTypes.array.isRequired,
  title: PropTypes.string
};

ExchangesList.defaultProps = {
  title: 'Active Exchanges'
};

export default ExchangesList;
