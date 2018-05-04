import React from 'react';
import PropTypes from 'prop-types';

const ExchangeStep2 = ({items}) => {
  return items.map(item => <div key={item.id}>{item.title}</div>);
};

ExchangeStep2.propTypes = {
  items: PropTypes.array.isRequired
};

export default ExchangeStep2;
