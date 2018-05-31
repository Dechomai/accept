import './List.scss';

import React from 'react';
import PropTypes from 'prop-types';

import ExchangeOfferWrapper from './ExchangeOfferWrapper';
import Pagination from '../../components/common/Pagination/Pagination';

const ExchangesList = ({exchanges, title, count, skip, limit, ...props}) => (
  <div className="exchanges-list">
    <div className="exchanges-list__header">
      <h5>{title}</h5>
      <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
    </div>
    <h6 className="exchanges-list__subtitle">Exchange offer</h6>
    {exchanges.map(exchange => (
      <ExchangeOfferWrapper key={exchange.id} exchange={exchange} {...props} />
    ))}
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
