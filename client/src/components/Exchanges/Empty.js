import './Empty.scss';
import React from 'react';

const ExchangesEmpty = () => {
  return (
    <div className="exchanges-empty">
      <img
        src="/assets/img/exchanges-empty.png"
        alt="No Exchanges"
        className="exchanges-empty__image"
      />
      <p className="exchanges-empty__text">
        Looks like you don’t have any offer <br /> on the this step
      </p>
    </div>
  );
};

export default ExchangesEmpty;
