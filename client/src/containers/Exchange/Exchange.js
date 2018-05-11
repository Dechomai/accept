import './Exchange.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';

import ExchangeModal from '../../components/Exchange/Modal';
import ExchangeStep1 from '../../containers/Exchange/Step1';
import ExchangeStep2 from '../../containers/Exchange/Step2';
import ExchangeStep3 from '../../containers/Exchange/Step3';
import ExchangeStep4 from '../../containers/Exchange/Step4';
import ExchangeItem from '../../components/Exchange/ExchangeItem';
import ExchangeEscrow from '../../components/Exchange/Escrow';

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      step: 0,
      selectedType: null,
      selectedItem: null,

      ownCount: 1,
      partnerCount: 1
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
      selectedType: type,
      step: 1
    });
  }

  handleItemSelect(item) {
    this.setState({
      selectedItem: item,
      step: 2
    });
  }

  handleOwnItemQuantityChange(num) {
    this.setState({ownCount: num});
  }

  handlePartnerItemQuantityChange(num) {
    this.setState({partnerCount: num});
  }

  handleAvailabilityDaysChange(days) {
    this.setState({ownDays: days});
  }

  handleAvailabilityTimeChange(time) {
    this.setState({ownTime: time});
  }

  calculateEscrow() {
    const ownItem = this.state.selectedItem;
    const partnerItem = this.props.item;

    return Math.min(
      ownItem.price * this.state.ownCount,
      partnerItem.price * this.state.partnerCount
    );
  }

  calculateEscrowDifference() {
    const ownItem = this.state.selectedItem;
    const partnerItem = this.props.item;
    const escrow = this.calculateEscrow();

    return Math.max(
      ownItem.price * this.state.ownCount - escrow,
      partnerItem.price * this.state.partnerCount - escrow
    );
  }

  isNextBtnDisabled() {
    return this.state.step !== 2;
  }

  isBackBtnDisabled() {
    return this.state.step === 0;
  }

  getStepTitle() {
    return 'Offer to Exchange';
  }

  getStepNextBtnCaption() {
    return this.state.step === 3 ? 'Send Offer' : 'Next';
  }

  getStepSubTitle() {
    switch (this.state.step) {
      case 0:
      case 1:
      case 2:
        return 'Step 1. Set offer';
      case 3:
        return 'Step 2. Smart Contract';
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
              <ExchangeItem
                item={this.props.item}
                type={this.props.type}
                quantity={this.state.partnerCount}
                onQuantityChange={this.handlePartnerItemQuantityChange}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep2 type={this.state.selectedType} onItemSelect={this.handleItemSelect} />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem
                item={this.props.item}
                type={this.props.type}
                quantity={this.state.partnerCount}
                onQuantityChange={this.handlePartnerItemQuantityChange}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep3
                type={this.state.selectedType}
                item={this.state.selectedItem}
                quantity={this.state.ownCount}
                days={this.state.ownDays}
                time={this.state.ownTime}
                onQuantityChange={this.handleOwnItemQuantityChange}
                onDaysChange={this.handleAvailabilityDaysChange}
                onTimeChange={this.handleAvailabilityTimeChange}
              />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem
                item={this.props.item}
                type={this.props.type}
                quantity={this.state.partnerCount}
                onQuantityChange={this.handlePartnerItemQuantityChange}
              />
              <ExchangeEscrow
                difference={this.calculateEscrowDifference()}
                escrow={this.calculateEscrow()}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="exchange-content">
            <ExchangeStep4
              ownItemId={this.state.selectedItem.id}
              ownType={this.state.selectedType}
              ownCount={this.state.ownCount}
              ownDays={this.state.ownDays}
              ownTime={this.state.ownTime}
              wantedItem={this.props.item}
              wantedType={this.props.type}
              wantedCount={this.state.partnerCount}
              difference={this.calculateEscrowDifference()}
              escrow={this.calculateEscrow()}
            />
          </div>
        );
    }
  }

  render() {
    return (
      <ExchangeModal
        title={this.getStepTitle()}
        subtitle={this.getStepSubTitle()}
        nextBtnCaption={this.getStepNextBtnCaption()}
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
