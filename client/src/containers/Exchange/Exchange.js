import './Exchange.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';

import ExchangeModal from '../../components/Exchange/Modal';
import ExchangeStep1 from '../../containers/Exchange/Step1';
import ExchangeStep2 from '../../containers/Exchange/Step2';
import ExchangeStep3 from '../../containers/Exchange/Step3';
import ExchangeItem from '../../components/Exchange/ExchangeItem';

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      step: 0,
      itemType: null,
      selectedItem: null
    };
  }

  handleCancelClick() {
    this.props.onCancel();
  }

  handleBackBtnClick() {
    this.setState({
      step: this.state.step - 1
    });
  }

  handleNextBtnClick() {
    this.setState({step: this.state.step + 1});
  }

  handleTypeSelect(type) {
    this.setState({
      itemType: type,
      step: 1
    });
  }

  handleItemSelect(item) {
    this.setState({
      selectedItem: item,
      step: 2
    });
  }

  isNextBtnDisabled() {
    return true;
  }

  isBackBtnDisabled() {
    return this.state.step === 0;
  }

  getStepTitle() {
    return 'Offer to Exchange';
  }

  getStepSubTitle() {
    switch (this.state.step) {
      case 0:
        return 'Step 1. Set offer';
      case 1:
        return 'Step 1. Set offer';
      case 2:
        return 'Step 1. Set offer';
    }
  }

  getStep() {
    switch (this.state.step) {
      case 0:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep1 onTypeSelect={this.handleTypeSelect} />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem item={this.props.item} type={this.props.type} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep2 itemType={this.state.itemType} onItemSelect={this.handleItemSelect} />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem item={this.props.item} type={this.props.type} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep3 item={this.state.selectedItem} />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem item={this.props.item} type={this.props.type} />
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <ExchangeModal
        title={this.getStepTitle()}
        subtitle={this.getStepSubTitle()}
        nextBtnDisabled={this.isNextBtnDisabled()}
        backBtnDisabled={this.isBackBtnDisabled()}
        onCancelBtnClick={this.handleCancelClick}
        onNextBtnClick={this.handleNextBtnClick}
        onBackBtnClick={this.handleBackBtnClick}>
        {this.getStep()}
      </ExchangeModal>
    );
  }
}

Exchange.propTypes = {
  item: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['product', 'service']).isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Exchange;
