import './Step3.scss';

import React from 'react';
import ExchangeItem from '../../components/Exchange/ExchangeItem';

const ExchangeStep3 = ({item}) => {
  return (
    <div className="exchange-step3">
      <ExchangeItem item={item} title="Your offer" />
    </div>
  );
};

export default ExchangeStep3;