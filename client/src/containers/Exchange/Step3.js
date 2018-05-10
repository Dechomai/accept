import './Step3.scss';

import React from 'react';
import ExchangeItem from '../../components/Exchange/ExchangeItem';

const ExchangeStep3 = ({...props}) => {
  return (
    <div className="exchange-step3">
      <ExchangeItem title="Your offer" own {...props} />
    </div>
  );
};

export default ExchangeStep3;
