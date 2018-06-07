import './StepSignature.scss';

import React from 'react';
import PropTypes from 'prop-types';
import Signature from '../../components/Exchange/Signature';

const StepSignature = ({onSigned}) => {
  return (
    <div className="exchange-step-signature">
      <h4 className="exchange-step-signature__title">
        Please, trace the logo to confirm your offer and agree to the Accept.IO marketplace rules,
        and in the event of a transaction dispute, you agree to be bound by the Accept Star Council
        rules of arbitration and any decision made as a result of this arbitration process.
      </h4>
      <Signature onSigned={onSigned} />
      <img className="exchange-step-signature__image" src={`/assets/img/signature.png`} />
    </div>
  );
};

StepSignature.propTypes = {
  onSigned: PropTypes.func.isRequired
};

export default StepSignature;
