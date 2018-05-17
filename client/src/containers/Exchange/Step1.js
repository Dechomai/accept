import './Step1.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {connect} from 'react-redux';
import {selectItemType} from '../../actions/exchange';

const ExchangeStep1 = ({selectItemType, stepChanged}) => {
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
            selectItemType('product');
            stepChanged('ITEM_SELECTION');
          }}>
          Select Good
        </Button>
        <span className="my-3">or</span>
        <Button
          outline
          color="secondary"
          onClick={() => {
            selectItemType('product');
            stepChanged('ITEM_SELECTION');
          }}>
          Select Service
        </Button>
      </div>
    </div>
  );
};

ExchangeStep1.propTypes = {
  stepChanged: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  selectItemType(type) {
    return dispatch(selectItemType(type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeStep1);
