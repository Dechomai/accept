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
import {
  selectExchangeItemType,
  selectExchangeItem,
  selectExchangeOwnCount,
  selectExchangePartnerCount,
  selectExchangeOwnDays,
  selectExchangeOwnTime
} from '../../selectors';
import {
  selectItemType,
  selectItem,
  changeOwnCount,
  changePartnerCount,
  changeOwnDays,
  changeOwnTime
} from '../../actions/exchange';

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
    this.props.selectItem(item);
    this.setStepQuery(Steps.DETAILS_SPECIFICATION);
  }

  handleOwnItemQuantityChange(num) {
    this.props.changeOwnCount(num);
  }

  handlePartnerItemQuantityChange(num) {
    this.props.changePartnerCount(num);
  }

  handleAvailabilityDaysChange(days) {
    this.props.changeOwnDays(days);
  }

  handleAvailabilityTimeChange(time) {
    this.props.changeOwnTime(time);
  }

  calculateEscrow() {
    const ownItem = this.props.selectedItem;
    const partnerItem = this.props.item;

    return Math.min(
      ownItem.price * this.props.ownCount,
      partnerItem.price * this.props.partnerCount
    );
  }

  calculateEscrowDifference() {
    const ownItem = this.props.selectedItem;
    const partnerItem = this.props.item;
    const escrow = this.calculateEscrow();

    return Math.max(
      ownItem.price * this.props.ownCount - escrow,
      partnerItem.price * this.props.partnerCount - escrow
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
                quantity={this.props.partnerCount}
                onQuantityChange={this.handlePartnerItemQuantityChange}
              />
            </div>
          </div>
        );
      case Steps.ITEM_SELECTION:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep2 type={this.props.selectedType} onItemSelect={this.handleItemSelect} />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem
                item={this.props.item}
                type={this.props.type}
                quantity={this.props.partnerCount}
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
                item={this.props.selectedItem}
                quantity={this.props.ownCount}
                days={this.props.ownDays}
                time={this.props.ownTime}
                onQuantityChange={this.handleOwnItemQuantityChange}
                onDaysChange={this.handleAvailabilityDaysChange}
                onTimeChange={this.handleAvailabilityTimeChange}
              />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem
                item={this.props.item}
                type={this.props.type}
                quantity={this.props.partnerCount}
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
              ownItemId={this.props.selectedItem.id}
              ownType={this.props.selectedType}
              ownCount={this.props.ownCount}
              ownDays={this.props.ownDays}
              ownTime={this.props.ownTime}
              wantedItem={this.props.item}
              wantedType={this.props.type}
              wantedCount={this.props.partnerCount}
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
  onCancel: PropTypes.func.isRequired,
  selectedType: PropTypes.string,
  selectedItem: PropTypes.object,
  ownCount: PropTypes.number,
  partnerCount: PropTypes.number,
  ownDays: PropTypes.array,
  ownTime: PropTypes.array,
  selectItemType: PropTypes.func,
  selectItem: PropTypes.func,
  changeOwnCount: PropTypes.func,
  changePartnerCount: PropTypes.func
};

const mapStateToProps = state => ({
  selectedType: selectExchangeItemType(state),
  selectedItem: selectExchangeItem(state),
  ownCount: selectExchangeOwnCount(state),
  partnerCount: selectExchangePartnerCount(state),
  ownDays: selectExchangeOwnDays(state),
  ownTime: selectExchangeOwnTime(state)
});

const mapDispatchToProps = dispatch => ({
  selectItemType(type) {
    return dispatch(selectItemType(type));
  },
  selectItem(item) {
    return dispatch(selectItem(item));
  },
  changeOwnCount(count) {
    return dispatch(changeOwnCount(count));
  },
  changePartnerCount(count) {
    return dispatch(changePartnerCount(count));
  },
  changeOwnDays(days) {
    return dispatch(changeOwnDays(days));
  },
  changeOwnTime(time) {
    return dispatch(changeOwnTime(time));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Exchange);
