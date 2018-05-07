import './Step1.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';

const ExchangeStep1 = ({onTypeSelect}) => {
  return (
    <div className="exchange-step1">
      <h6 className="exchange-step1__header">Your Offer</h6>
      <p className="exchange-step1__text">
        Choose what you would like to offer to exchange <br /> for this good:
      </p>
      <div className="exchange-step1__btns">
        <Button
          outline
          color="secondary"
          onClick={() => {
            onTypeSelect('product');
          }}>
          Select Good
        </Button>
        <span className="my-3">or</span>
        <Button
          outline
          color="secondary"
          onClick={() => {
            onTypeSelect('service');
          }}>
          Select Service
        </Button>
      </div>
    </div>
  );
};

ExchangeStep1.propTypes = {
  onTypeSelect: PropTypes.func.isRequired
};

export default ExchangeStep1;
