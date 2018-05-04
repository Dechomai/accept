import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';

import ExchangeItem from './ExchangeItem';

const ExchangeStep1 = ({item, onTypeSelect}) => {
  return (
    <React.Fragment>
      <div className="exchange-modal__offer">
        <h6 className="exchange-modal__content__header">Your Offer</h6>
        <p className="exchange-modal__content__text">
          Choose what you would like to offer to exchange <br /> for this good:
        </p>
        <div className="exchange-modal__select-item">
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
      <ExchangeItem className="exchange-modal__item-for-exchange" item={item} />
    </React.Fragment>
  );
};

ExchangeStep1.propTypes = {
  item: PropTypes.any.isRequired,
  onTypeSelect: PropTypes.func.isRequired
};

export default ExchangeStep1;
