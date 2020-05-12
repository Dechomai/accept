import './List.scss';

import React from 'react';
import PropTypes from 'prop-types';

import ExchangeOfferWrapper from './ExchangeOfferWrapper';
import Pagination from '../../components/common/Pagination/Pagination';
import PagedList from '../common/Pagination/PagedList';
import Icon from '../common/Icon/Icon';
import Empty from '../Exchanges/Empty';

const ExchangesList = ({exchanges, title, onRefreshBtnClick, count, skip, limit, ...props}) => (
  <div className="exchanges-list">
    <div className="exchanges-list__header">
      <div className="exchanges-list__title">
        <h5>{title}</h5>
        <Icon name="refresh" size="24" onClick={onRefreshBtnClick} />
      </div>
      {!!exchanges.length && (
        <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
      )}
    </div>
    {exchanges.length ? (
      <React.Fragment>
        <h6 className="exchanges-list__subtitle">Exchange offer</h6>
        <PagedList page={Math.floor(skip / limit)}>
          {exchanges.map(exchange => (
            <ExchangeOfferWrapper key={exchange.id} exchange={exchange} {...props} />
          ))}
        </PagedList>
        <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
      </React.Fragment>
    ) : (
      <Empty />
    )}
  </div>
);

ExchangesList.propTypes = {
  exchanges: PropTypes.array.isRequired,
  title: PropTypes.string,
  count: PropTypes.number,
  skip: PropTypes.number,
  limit: PropTypes.number,
  onRefreshBtnClick: PropTypes.func.isRequired
};

ExchangesList.defaultProps = {
  title: 'Active Exchanges'
};

export default ExchangesList;
