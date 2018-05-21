import React from 'react';

import ExchangeOffer from './ExchangeOffer';

const ExchagesIncoming = () => {
  return (
    <div className="exchanges">
      <ExchangeOffer isOwner={true} />
      <ExchangeOffer isOwner={true} />
    </div>
  );
};

export default ExchagesIncoming;
