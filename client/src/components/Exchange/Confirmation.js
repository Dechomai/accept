import './Confirmation.scss';

import React from 'react';
import PropTypes from 'prop-types';

const TITLES = {
  waiting: 'Waiting for transaction acceptance',
  rejected: 'Transaction Rejected',
  accepted: 'Transaction Complete',
  cancelling: 'Transaction Cancelling...'
};

const DETAILS = {
  waiting: "Please don't leave this page untill transaction is completed."
};

const StepConfirm = ({state}) => {
  return (
    <div className="exchange-step-confirm">
      <img
        className="exchange-step-confirm__image"
        src={`/assets/img/exchange-transaction-${state}.png`}
        alt={state}
      />
      <h4 className="exchange-step-confirm__title">{TITLES[state]}</h4>
      <p className="exchange-step-confirm__details">{DETAILS[state]}</p>
    </div>
  );
};

StepConfirm.propTypes = {
  state: PropTypes.oneOf(['waiting', 'accepted', 'rejected'])
};

export default StepConfirm;
