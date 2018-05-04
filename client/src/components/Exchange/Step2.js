import React from 'react';
import PropTypes from 'prop-types';

const ExchangeStep2 = ({items}) => {
  return (
    <React.Fragment>{items.map(item => <div key={item.id}>{item.title}</div>)}</React.Fragment>
  );
};

ExchangeStep2.propTypes = {
  items: PropTypes.array.isRequired
};

export default ExchangeStep2;
