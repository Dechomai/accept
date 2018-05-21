import React from 'react';

import ExchangesNavigation from '../components/Exchanges/Navigation';

const Exchanges = ({children}) => {
  return (
    <div className="exchanges-page">
      <div className="container">
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
