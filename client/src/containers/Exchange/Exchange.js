import './Exchange.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompact';
import autobind from 'autobindr';
import {path} from 'ramda';

import {
  selectProfile,
  selectExchangeStep,
  selectExchangeItemType,
  selectExchangeItemId,
  selectExchangeOwnCount,
  selectExchangePartnerCount,
  selectExchangeOwnDays,
  selectExchangeOwnTime,
  selectServiceById,
  selectProductById,
  selectExchangePartnerDays,
  selectExchangePartnerTime
} from '../../selectors';
import {
  selectItemType,
  selectItem,
  changeStep,
  changeOwnCount,
  changePartnerCount,
  changeOwnDays,
  changeOwnTime,
  changePartnerTime,
  changePartnerDays
} from '../../actions/exchange';
import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';
import {calculateEscrow, calculateEscrowDifference} from '../../utils/exchange';

import ExchangeStep1 from './Step1';
import ExchangeStep2 from './Step2';
import ExchangeStep3 from './Step3';
import ExchangeStep4 from './Step4';
import ExchangeStep5 from './Step5';
import ExchangeStep6 from './Step6';
import ExchangeStepConfirm from './StepConfirm';
import ExchangeItem from './ExchangeItem';

import ExchangeModal from '../../components/Exchange/Modal';
import ExchangeEscrow from '../../components/Exchange/Escrow';

const Steps = {
  TYPE_SELECTION: 0,
  ITEM_SELECTION: 1,
  DETAILS_SPECIFICATION: 2,
  SUMMARY: 3,
  CONNECTION_CHECK: 4,
  TRANSACTION_CONFIRM: 5,
  TRANSACTION_RESULT: 6
};

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      isConnectionValid: false
    };
    this.connectionCheck = null;
  }

  handleCancelClick() {
    this.props.onCancel();
  }

  handleBackBtnClick() {
    const {step, changeStep} = this.props;
    changeStep(step - 1);
  }

  handleNextBtnClick() {
    const {step, changeStep} = this.props;
    if (step === Steps.CONNECTION_CHECK) {
      this.connectionCheck && this.connectionCheck.updateConnectionStatus();
    } else if (step === Steps.TRANSACTION_RESULT) {
      this.props.onCancel();
    } else {
      changeStep(step + 1);
    }
  }

  handlePartnerItemQuantityChange(num) {
    this.props.changePartnerCount(num);
  }

  handleConnectionCheckSuccess() {
    const {changeStep} = this.props;
    changeStep(Steps.TRANSACTION_CONFIRM);
  }

  handleTransactionStatusChange(status) {
    this.setState({
      transactionStatus: status
    });
    const {changeStep} = this.props;
    changeStep(Steps.TRANSACTION_RESULT);
  }

  calculateEscrow() {
    const ownItem = this.props.selectedItem.data;
    const partnerItem = this.props.partnerItem.data;

    return calculateEscrow(
      ownItem.price,
      this.props.ownCount,
      partnerItem.price,
      this.props.partnerCount
    );
  }

  calculateEscrowDifference() {
    const ownItem = this.props.selectedItem.data;
    const partnerItem = this.props.partnerItem.data;

    return calculateEscrowDifference(
      ownItem.price,
      this.props.ownCount,
      partnerItem.price,
      this.props.partnerCount
    );
  }

  isBackBtnDisabled() {
    const {step} = this.props;
    return step === Steps.TYPE_SELECTION || step === Steps.TRANSACTION_CONFIRM;
  }

  isCancelBtnDisabled() {
    const {step} = this.props;
    return step === Steps.TRANSACTION_CONFIRM;
  }

  isNextBtnDisabled() {
    const {step, ownCount, partnerCount} = this.props;
    return step < Steps.DETAILS_SPECIFICATION || !ownCount || !partnerCount;
  }

  isBackBtnShown() {
    const {step} = this.props;
    return step !== Steps.TRANSACTION_RESULT;
  }

  isCancelBtnShown() {
    const {step} = this.props;
    return step !== Steps.TRANSACTION_RESULT;
  }

  isNextBtnShown() {
    return true;
  }

  handleStepChange(stepName) {
    this.props.changeStep(Steps[stepName]);
  }

  handleDataAbsence() {
    this.props.changeStep(Steps.TYPE_SELECTION);
  }

  isFooterShown() {
    const {step} = this.props;
    return step !== Steps.TRANSACTION_CONFIRM;
  }

  getStepTitle() {
    return 'Offer to Exchange';
  }

  getStepNextBtnCaption() {
    const {step} = this.props;

    switch (step) {
      case Steps.SUMMARY:
        return 'Send Offer';
      case Steps.CONNECTION_CHECK:
        return 'Try Again';
      case Steps.TRANSACTION_RESULT:
        return 'Ok';
      default:
        return 'Next';
    }
  }

  getStepSubTitle() {
    const {step} = this.props;
    switch (step) {
      case Steps.TYPE_SELECTION:
      case Steps.ITEM_SELECTION:
      case Steps.DETAILS_SPECIFICATION:
        return 'Step 1. Set offer';
      case Steps.SUMMARY:
        return 'Step 2. Smart Contract';
      case Steps.CONNECTION_CHECK:
        return 'Check Connection';
      case Steps.TRANSACTION_CONFIRM:
        return 'Processing...';
      case Steps.TRANSACTION_RESULT:
        return 'Result';
    }
  }

  getStep() {
    const {step} = this.props;

    switch (step) {
      case Steps.TYPE_SELECTION:
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep1 onSelect={this.handleStepChange} />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem
                itemId={this.props.itemId}
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
              <ExchangeStep2
                stepChanged={this.handleStepChange}
                onDataAbsent={this.handleDataAbsence}
              />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem
                itemId={this.props.itemId}
                type={this.props.type}
                quantity={this.props.partnerCount}
                onQuantityChange={this.handlePartnerItemQuantityChange}
              />
            </div>
          </div>
        );
      case Steps.DETAILS_SPECIFICATION: {
        const showEscrow =
          path(['data'], this.props.selectedItem) && path(['data'], this.props.partnerItem);
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep3
                type={this.props.selectedType}
                itemId={this.props.selectedItemId}
                onDataAbsent={this.handleDataAbsence}
              />
            </div>
            <div className="exchange-content__item">
              <ExchangeItem
                itemId={this.props.itemId}
                type={this.props.type}
                quantity={this.props.partnerCount}
                onQuantityChange={this.handlePartnerItemQuantityChange}
              />
              {showEscrow && (
                <ExchangeEscrow
                  difference={this.calculateEscrowDifference()}
                  escrow={this.calculateEscrow()}
                />
              )}
            </div>
          </div>
        );
      }
      case Steps.SUMMARY:
        return (
          <div className="exchange-content">
            <ExchangeStep4
              ownItemId={this.props.selectedItemId}
              ownItemType={this.props.selectedType}
              partnerItemId={this.props.itemId}
              partnerItemType={this.props.type}
              ownCount={this.props.ownCount}
              ownDays={this.props.ownDays}
              ownTime={this.props.ownTime}
              partnerCount={this.props.partnerCount}
              partnerDays={this.props.partnerDays}
              partnerTime={this.props.partnerTime}
              calculateEscrowDifference={this.calculateEscrowDifference}
              calculateEscrow={this.calculateEscrow}
              onDataAbsent={this.handleDataAbsence}
            />
          </div>
        );
      case Steps.CONNECTION_CHECK: {
        const address = path(['user', 'data', 'bcDefaultAccountAddress'], this.props);
        return (
          <ExchangeStep5
            onSuccess={this.handleConnectionCheckSuccess}
            onDataAbsent={this.handleDataAbsence}
            address={address}
            getRef={el => {
              this.connectionCheck = el;
            }}
          />
        );
      }
      case Steps.TRANSACTION_CONFIRM:
        return (
          <ExchangeStep6
            partnerItemId={this.props.itemId}
            partnerItemType={this.props.type}
            onComplete={this.handleTransactionStatusChange}
            onDataAbsent={this.handleDataAbsence}
          />
        );
      case Steps.TRANSACTION_RESULT:
        return (
          <ExchangeStepConfirm
            state={this.state.transactionStatus}
            onDataAbsent={this.handleDataAbsence}
          />
        );
      default:
        this.props.changeStep(Steps.TYPE_SELECTION);
    }
  }

  render() {
    return (
      <ExchangeModal
        title={this.getStepTitle()}
        subtitle={this.getStepSubTitle()}
        showBackBtn={this.isBackBtnShown()}
        showCancelBtn={this.isCancelBtnShown()}
        showNextBtn={this.isNextBtnShown()}
        backBtnDisabled={this.isBackBtnDisabled()}
        cancelBtnDisabled={this.isCancelBtnDisabled()}
        nextBtnDisabled={this.isNextBtnDisabled()}
        nextBtnCaption={this.getStepNextBtnCaption()}
        onBackBtnClick={this.handleBackBtnClick}
        onCancelBtnClick={this.handleCancelClick}
        onNextBtnClick={this.handleNextBtnClick}
        showFooter={this.isFooterShown()}>
        {this.getStep()}
      </ExchangeModal>
    );
  }
}

Exchange.propTypes = {
  itemId: PropTypes.string.isRequired, // partner
  type: PropTypes.oneOf(['product', 'service']).isRequired,
  onCancel: PropTypes.func.isRequired,
  selectedType: PropTypes.string,
  selectedItem: PropTypes.object,
  ownCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  partnerCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  ownDays: PropTypes.array,
  ownTime: PropTypes.array,
  partnerDays: PropTypes.array,
  partnerTime: PropTypes.array,
  selectItemType: PropTypes.func,
  selectItem: PropTypes.func,
  changeOwnCount: PropTypes.func,
  changePartnerCount: PropTypes.func,
  changeOwnTime: PropTypes.func,
  changeOwnDays: PropTypes.func
};

const mapStateToProps = (state, {type, itemId}) => {
  const selectedType = selectExchangeItemType(state);
  const selectedItemId = selectExchangeItemId(state);
  const selectedItem =
    selectedType === 'product'
      ? selectProductById(state, selectedItemId)
      : selectServiceById(state, selectedItemId);

  return {
    step: selectExchangeStep(state),
    partnerItem:
      type === 'product' ? selectProductById(state, itemId) : selectServiceById(state, itemId),
    user: selectProfile(state),
    selectedType,
    selectedItemId,
    selectedItem,
    ownCount: selectExchangeOwnCount(state),
    partnerCount: selectExchangePartnerCount(state),
    ownDays: selectExchangeOwnDays(state),
    ownTime: selectExchangeOwnTime(state),
    partnerDays: selectExchangePartnerDays(state),
    partnerTime: selectExchangePartnerTime(state)
  };
};

const mapDispatchToProps = dispatch => ({
  selectItemType(type) {
    return dispatch(selectItemType(type));
  },
  selectItem(item) {
    return dispatch(selectItem(item));
  },
  changeStep(step) {
    return dispatch(changeStep(step));
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
  },
  onPartnerDaysChange(days) {
    return dispatch(changePartnerDays(days));
  },
  onPartnerTimeChange(time) {
    return dispatch(changePartnerTime(time));
  },
  fetchProduct(id) {
    return dispatch(fetchProductById(id));
  },
  fetchService(id) {
    return dispatch(fetchServiceById(id));
  }
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      const {step, changeStep} = this.props;
      if (step > Steps.CONNECTION_CHECK) changeStep(Steps.SUMMARY);
    }
  })
)(Exchange);
