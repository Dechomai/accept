import './Header.scss';

import React from 'react';

const ExchangesHeader = () => {
  return (
    <div className="exchanges-header">
      <div className="container">
        <div className="row">
          <div className="col-12 exchanges-header__content">
            <h5 className="exchanges-header__title">Account Activity</h5>
            <div className="exchanges-header__link">
              <span className="exchanges-header__link__text">Exchange</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangesHeader;
