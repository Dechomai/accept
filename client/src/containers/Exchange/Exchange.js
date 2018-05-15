import './Exchange.scss';

import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {withRouter} from 'react-router';
import {compose} from 'ramda';

import ExchangeModal from '../../components/Exchange/Modal';
import ExchangeStep1 from '../../containers/Exchange/Step1';
import ExchangeStep2 from '../../containers/Exchange/Step2';
import ExchangeStep3 from '../../containers/Exchange/Step3';
import ExchangeStep4 from '../../containers/Exchange/Step4';
import ExchangeItem from '../../components/Exchange/ExchangeItem';
import ExchangeEscrow from '../../components/Exchange/Escrow';
import ConnectionCheckModal from '../../components/Exchange/ConnectionCheckModal';
import {selectExchangeItemType} from '../../selectors';
import {selectItemType} from '../../actions/exchange';

const Steps = {
  TYPE_SELECTION: 0,
  ITEM_SELECTION: 1,
  DETAILS_SPECIFICATION: 2,
  SUMMARY: 3,
  CONNECTION_CHECK: 4
};

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      selectedItem: null,
      ownCount: 1,
      partnerCount: 1,
      isConnectionCheckCancelled: false
    };

    const step = this.getStepFromQuery();

    if (step) {
      this.setStepQuery(step);
    } else {
      this.setStepQuery(Steps.TYPE_SELECTION);
    }
  }

  handleCancelClick() {
    this.props.onCancel();
  }

  handleBackBtnClick() {
    const step = this.getStepFromQuery();
    this.setStepQuery(step - 1);
  }

  handleNextBtnClick() {
    const step = this.getStepFromQuery();
    this.setStepQuery(step + 1);
  }

  handleTypeSelect(type) {
    this.props.selectItemType(type);
    this.setStepQuery(Steps.ITEM_SELECTION);
  }

  handleItemSelect(item) {
    this.setState({
      selectedItem: item
    });
    this.setStepQuery(Steps.DETAILS_SPECIFICATION);
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
    const step = this.getStepFromQuery();
    return step < Steps.DETAILS_SPECIFICATION;
  }

  isBackBtnDisabled() {
    const step = this.getStepFromQuery();
    return step === Steps.TYPE_SELECTION;
  }

  getStepFromQuery() {
    const {step} = this.props.router.location.query;
    return step ? parseInt(step) : 0;
  }

  setStepQuery(step) {
    const {router} = this.props;

    router.push({
      pathname: router.location.pathname,
      query: {
        step
      }
    });
  }

  getStepTitle() {
    return 'Offer to Exchange';
  }

  getStepNextBtnCaption() {
    const step = this.getStepFromQuery();
    return step === Steps.SUMMARY ? 'Send Offer' : 'Next';
  }

  getStepSubTitle() {
    const step = this.getStepFromQuery();
    switch (step) {
      case Steps.TYPE_SELECTION:
      case Steps.ITEM_SELECTION:
      case Steps.DETAILS_SPECIFICATION:
        return 'Step 1. Set offer';
      case Steps.SUMMARY:
        return 'Step 2. Smart Contract';
    }
  }

  getStep() {
    const step = this.getStepFromQuery();

    switch (step) {
      case Steps.TYPE_SELECTION:
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
      case Steps.ITEM_SELECTION:
        console.log(this.props);
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep2 type={this.props.selectedType} onItemSelect={this.handleItemSelect} />
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
      case Steps.DETAILS_SPECIFICATION:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep3
                type={this.props.selectedType}
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
      case Steps.SUMMARY:
        return (
          <div className="exchange-content">
            <ExchangeStep4
              ownItemId={this.state.selectedItem.id}
              ownType={this.props.selectedType}
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
      case Steps.CONNECTION_CHECK:
        return (
          !this.state.isConnectionCheckCancelled && (
            <ConnectionCheckModal
              step={this.state.connectionStep}
              onCancelBtnClick={() => this.setState({isConnectionCheckCancelled: true})}
            />
          )
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
  currentStep: PropTypes.any,
  onCancel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  selectedType: selectExchangeItemType(state)
});

const mapDispatchToProps = dispatch => ({
  selectItemType(type) {
    return dispatch(selectItemType(type));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Exchange);
