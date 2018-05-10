import './Step3.scss';

import React from 'react';
import ExchangeItem from '../../components/Exchange/ExchangeItem';

const ExchangeStep3 = ({item, type}) => {
  return (
    <div className="exchange-step3">
      <ExchangeItem item={item} type={type} title="Your offer" own />
    </div>
  );
};

export default ExchangeStep3;
