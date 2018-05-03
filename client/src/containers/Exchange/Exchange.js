import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';

import ExchangeModal from '../../components/Exchange/Modal';
import ExchangeStep1 from '../../components/Exchange/Step1';
// import ExchangeStep2 from '../../components/Exchange/Step2';

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      step: 0
    };
  }

  handleCancelClick() {
    this.props.onCancel();
  }

  handleNextBtnClick() {
    this.setState({step: this.state.step + 1});
  }

  handleTypeSelect(type) {
    // save to state, set step = 1
    console.log('type selected', type);
  }

  isNextBtnDisabled() {
    return true;
  }

  getStepTitle() {
    return 'Offer to Exchange';
  }

  getStepSubTitle() {
    switch (this.state.step) {
      case 0:
        return 'Step 1. Set offer';
    }
  }

  getStep() {
    switch (this.state.step) {
      case 0:
        return <ExchangeStep1 item={this.props.item} onTypeSelect={this.handleTypeSelect} />;
    }
  }

  render() {
    return (
      <ExchangeModal
        title={this.getStepTitle()}
        subtitle={this.getStepSubTitle()}
        nextBtnDisabled={this.isNextBtnDisabled()}
        onCancelBtnClick={this.handleCancelClick}
        onNextBtnClick={this.handleNextBtnClick}>
        {this.getStep()}
      </ExchangeModal>
    );
  }
}

Exchange.propTypes = {
  item: PropTypes.any.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Exchange;
