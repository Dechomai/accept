import './exchanges.scss';

import React from 'react';

import ExchangesNavigation from '../components/Exchanges/Navigation';

const Exchanges = ({children}) => {
  return (
    <div className="exchanges-page">
      <div className="exchanges-page__header__wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h4 className="exchanges-page__header">Account activity</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <ExchangesNavigation />
          </div>
          <div className="col-9">
            <h5 className="exchanges-page__title">Active exchanges</h5>
            <h6 className="exchanges-page__subtitle">Exchange offer</h6>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchanges;
