import React from 'react';

import ExchangesNavigation from '../components/Exchanges/Navigation';
import ExchangesHeader from '../components/Exchanges/Header';

const Exchanges = ({children}) => {
  return (
    <div className="exchanges-page">
      <ExchangesHeader />
      <div className="container mt-4">
        <div className="row">
          <div className="col-3">
            <ExchangesNavigation />
          </div>
          <div className="col-9">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Exchanges;
