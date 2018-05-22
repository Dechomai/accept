import './StepConfirm.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {lifecycle} from 'recompact';

const STATES = ['waiting', 'accepted', 'rejected', 'error'];

const TITLES = {
  waiting: 'Waiting for transaction acceptance',
  rejected: 'Transaction Rejected',
  accepted: 'Transaction Complete',
  error: 'There was an error with transaction'
};

const DETAILS = {};

const StepConfirm = ({state}) => {
  return (
    <div className="exchange-step-confirm">
      <h4 className="exchange-step-confirm__title">{TITLES[state]}</h4>
      <img
        className="exchange-step-confirm__image"
        src={`/assets/img/exchange-transaction-${state}.png`}
        alt={state}
      />
      <p className="exchange-step-confirm__details">{DETAILS[state]}</p>
    </div>
  );
};

StepConfirm.propTypes = {
  state: PropTypes.oneOf(STATES)
};

export default lifecycle({
  componentWillMount() {
    if (!STATES.includes(this.props.state)) {
      this.props.onDataAbsent();
    }
  }
})(StepConfirm);
