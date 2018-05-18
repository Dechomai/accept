import './Exchange.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import autobind from 'autobindr';
import {compose, path} from 'ramda';

import {
  selectProfile,
  selectExchangeItemType,
  selectExchangeItemId,
  selectExchangeOwnCount,
  selectExchangePartnerCount,
  selectExchangeOwnDays,
  selectExchangeOwnTime,
  selectServiceById,
  selectProductById
} from '../../selectors';
import {
  selectItemType,
  selectItem,
  changeOwnCount,
  changePartnerCount,
  changeOwnDays,
  changeOwnTime
} from '../../actions/exchange';
import {fetchProductById} from '../../actions/products';
import {fetchServiceById} from '../../actions/services';

import ExchangeStep1 from './Step1';
import ExchangeStep2 from './Step2';
import ExchangeStep3 from './Step3';
import ExchangeStep4 from './Step4';
import ExchangeStepConfirm from './StepConfirm';
import ExchangeItem from './ExchangeItem';

import ExchangeModal from '../../components/Exchange/Modal';
import ConnectionCheck from '../../components/Exchange/ConnectionCheck';
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

    let step = this.getStepFromQuery();
    if (step > Steps.SUMMARY) step = Steps.SUMMARY;
    this.setStepQuery(step || Steps.TYPE_SELECTION);
    this.connectionCheck = null;
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
    if (step === Steps.CONNECTION_CHECK) {
      this.connectionCheck && this.connectionCheck.updateConnectionStatus();
    } else if (step === Steps.TRANSACTION_RESULT) {
      this.props.onCancel();
    } else {
      this.setStepQuery(step + 1);
    }
  }

  handlePartnerItemQuantityChange(num) {
    this.props.changePartnerCount(num);
  }

  handleConnectionCheckSuccess() {
    const step = this.getStepFromQuery();
    this.setStepQuery(step + 1);

    /* eslint-disable */

    //  dispatch
    // TRANSACTION_REQUEST

    // register window.onbeforeunload callback
    // to prevent losing transaction callback if page refreshes or browser closes

    // TEMP
    web3.eth.sendTransaction(
      {
        from: this.props.address,
        to: '0x0f610b0a888734c4b329dd106f963b0F6848D7f8',
        value: web3.toWei('0.005', 'ether')
      },
      (err, transactionHash) => {
        this.setState({transactionStatus: err ? 'rejected' : 'accepted'});
        const step = this.getStepFromQuery();
        this.setStepQuery(step + 1);
      }
    );
  }

  calculateEscrow() {
    const ownItem = this.props.selectedItem.data;
    const partnerItem = this.props.parnerItem.data;

    return Math.min(
      ownItem.price * this.props.ownCount,
      partnerItem.price * this.props.partnerCount
    );
  }

  calculateEscrowDifference() {
    const ownItem = this.props.selectedItem.data;
    const partnerItem = this.props.parnerItem.data;
    const escrow = this.calculateEscrow();

    return Math.max(
      ownItem.price * this.props.ownCount - escrow,
      partnerItem.price * this.props.partnerCount - escrow
    );
  }

  isBackBtnDisabled() {
    const step = this.getStepFromQuery();
    return step === Steps.TYPE_SELECTION || step === Steps.TRANSACTION_CONFIRM;
  }

  isCancelBtnDisabled() {
    const step = this.getStepFromQuery();
    return step === Steps.TRANSACTION_CONFIRM;
  }

  isNextBtnDisabled() {
    const step = this.getStepFromQuery();
    return step < Steps.DETAILS_SPECIFICATION;
  }

  isBackBtnShown() {
    const step = this.getStepFromQuery();
    return step !== Steps.TRANSACTION_RESULT;
  }

  isCancelBtnShown() {
    const step = this.getStepFromQuery();
    return step !== Steps.TRANSACTION_RESULT;
  }

  isNextBtnShown() {
    return true;
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

  handleStepChange(stepName) {
    this.setStepQuery(Steps[stepName]);
  }

  isFooterShown() {
    const step = this.getStepFromQuery();
    return step !== Steps.TRANSACTION_CONFIRM;
  }

  getStepTitle() {
    return 'Offer to Exchange';
  }

  getStepNextBtnCaption() {
    const step = this.getStepFromQuery();

    switch (step) {
      case Steps.SUMMARY:
        return 'Send Offer';
      case Steps.CONNECTION_CHECK:
        return 'Refresh';
      case Steps.TRANSACTION_RESULT:
        return 'Ok';
      default:
        return 'Next';
    }
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
      case Steps.CONNECTION_CHECK:
        return 'Step 3. Check Connection';
      case Steps.TRANSACTION_CONFIRM:
      case Steps.TRANSACTION_RESULT:
        return 'Step 4: Confirm Transaction';
    }
  }

  getStep() {
    const step = this.getStepFromQuery();

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
              <ExchangeStep2 stepChanged={this.handleStepChange} />
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
          path(['data'], this.props.selectedItem) && path(['data'], this.props.parnerItem);
        return (
          <div className="exchange-content">
            <div className="exchange-content__offer">
              <ExchangeStep3 type={this.props.selectedType} itemId={this.props.selectedItemId} />
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
              // TODO: to be added
              // partnerDays={this.props.partnerDays}
              // partnerTime={this.props.partnerTime}
              calculateEscrowDifference={this.calculateEscrowDifference}
              calculateEscrow={this.calculateEscrow}
            />
          </div>
        );
      case Steps.CONNECTION_CHECK: {
        const address = path(['user', 'data', 'bcDefaultAccountAddress'], this.props);
        return (
          <ConnectionCheck
            onSuccess={this.handleConnectionCheckSuccess}
            address={address}
            ref={el => {
              this.connectionCheck = el;
            }}
          />
        );
      }
      case Steps.TRANSACTION_CONFIRM:
        return <ExchangeStepConfirm state="waiting" />;
      case Steps.TRANSACTION_RESULT:
        return <ExchangeStepConfirm state={this.state.transactionStatus} />;
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
    parnerItem:
      type === 'product' ? selectProductById(state, itemId) : selectServiceById(state, itemId),
    user: selectProfile(state),
    selectedType,
    selectedItemId,
    selectedItem,
    ownCount: selectExchangeOwnCount(state),
    partnerCount: selectExchangePartnerCount(state),
    ownDays: selectExchangeOwnDays(state),
    ownTime: selectExchangeOwnTime(state)
  };
};

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
  },
  fetchProduct(id) {
    return dispatch(fetchProductById(id));
  },
  fetchService(id) {
    return dispatch(fetchServiceById(id));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Exchange);
