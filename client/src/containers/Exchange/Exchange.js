import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';

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
      <Modal isOpen={true} toggle={this.handleCancelClick} className="exchange-modal" size="lg">
        <div className="exchange-modal__header">
          <h5 className="exchange-modal__title">{this.getStepTitle()}</h5>
          <p className="exchange-modal__subtitle">{this.getStepSubTitle()}</p>
        </div>
        <ModalBody>{this.getStep()}</ModalBody>
        <ModalFooter>
          <Button color="link" onClick={this.handleCancelClick}>
            Cancel
          </Button>
          <Button color="primary" disabled={this.isNextBtnDisabled()}>
            Next
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

Exchange.propTypes = {
  onCancel: PropTypes.func.isRequired
};

export default Exchange;
