import React from 'react';
import autobind from 'autobindr';
import {Button} from 'reactstrap';

import ExchangeOffer from './ExchangeOffer';
import DetailsModal from './DetailsModal';
import ConfirmationModal from '../common/ConfirmationModal/ConfirmationModal';
import ExchangeEscrow from '../../components/Exchange/Escrow';
import {calculateEscrow, calculateEscrowDifference} from '../../utils/exchange';
import Icon from '../common/Icon/Icon';
import UserLink from '../../components/common/UserLink/UserLink';
import ExchangeOfferItem from './ExchangeOfferItem';
import ExchangeAvailability from '../Exchange/ExchangeAvailability';
import clipboard from '../../services/clipboard';

const HELPER_TEXT = {
  incoming:
    'By accepting this offer, I agree to the Accept.IO marketplace rules, and in the event of a transaction dispute, I agree to be bound by the Accept Star Council rules of arbitration and any decision made as a result of this arbitration process.',
  outcoming:
    'The seller can accept your offer, decline your offer, or make a counter-offer. If your offer is accepted by the seller, you and the seller are required to complete the transaction.',
  accepted: 'Please validate the transaction once it has been successfully completed.',

  validatedByCurrentUser:
    'Once the other party has validated this transaction, the smart contract funds will be released',
  validatedByOtherUser:
    'Once you have validated this transaction, the smart contract funds will be released.',
  reported:
    'This transaction has been escalated to the Accept Star Council for arbitration. Further updates will follow. Use the Accept Arbitration DApp to receive detailed up-to-date information.',
  canceled: 'You’ve cancelled the offer.',
  completed: 'The offer was validated by both sides and is completed.',
  rejected: 'Your offer was rejected.'
};

const CONFIRMATION_TEXT = {
  accept:
    'By accepting this offer, I agree to the Accept.IO marketplace rules, and in the event of a transaction dispute, I agree to be bound by the Accept Star Council rules of arbitration and any decision made as a result of this arbitration process.',
  reject: 'Are you sure you want to Reject this offer? This cannot be undone.',
  validate: 'Are you sure you want to Validate this offer? This cannot be undone.',
  cancel: 'Are you sure you want to Cancel this offer? This cannot be undone.'
};

const TRANSACTION_INFO = {
  incoming:
    'By accepting the offer your account will be deducted for the escrow amount of Fulcrum (fee is charged separately). After the exchange is completed you will receive the deducted amount of Fulcrum back to your account.',
  outcoming:
    'The offer is successfully sent and is awaiting for your exchange partner to reply. Your offer can be either accepted or rejected. In case your offer is rejected or you cancel the deal before it is accepted/rejected - the escrowed amount of Fulcrum will be returned to your account.',
  accepted:
    'The exchange is in progress. Validate the deal after you’ve completely received your item from your exchange partner. After both sides validate the deal - the escrowed amount of Fulcrum will be released to your account. You can report a deal any time unless it’s com-pleted, thus the escrowed amount will be frozen until arbitrations are made.',
  validatedByCurrentUser:
    'You’ve validated the deal. After your exchange partner validates the deal the escrowed amount of Fulcrum will be released to your account.',
  validatedByOtherUser:
    'Your exchange partner has received your item and validated the deal. The exchange will be completed and escrowed amount of Fulcrum will be released to your account after you validate the deal. If you’ve faced a fraud - you can report the deal for further arbitrations.',
  reportedByInitiator:
    'You’ve reported the deal. Fulcrum located on the smart contract is frozen, unless arbitra-tions are made.',
  reportedByPartner:
    'Your exchange partner has reported the deal. Fulcrum located on the smart contract is frozen, unless arbitrations are made.'
};

class ExchangeOfferWrapper extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      detailsModalVisible: false,
      confirmationModalVisible: false,
      confirmationActionButton: null
    };
  }

  getStatus(exchange, user) {
    if (exchange.status === 'new' && user.data.id === exchange.initiator.id) {
      return {title: 'Offer Sent', modifier: 'offer-sent'};
    }

    if (exchange.status === 'new' && user.data.id === exchange.partner.id) {
      return {title: 'New offer', modifier: 'new-offer'};
    }

    if (exchange.status === 'canceled') {
      return {title: 'Canceled', modifier: 'canceled'};
    }

    if (exchange.status === 'accepted') {
      return {title: 'Accepted', modifier: 'accepted'};
    }

    if (exchange.status === 'rejected') {
      return {title: 'Rejected', modifier: 'rejected'};
    }

    if (exchange.status === 'validatedByInitiator' || exchange.status === 'validatedByPartner') {
      return {title: 'Awaiting validation', modifier: 'awaiting-validation'};
    }

    if (exchange.status === 'reportedByInitiator' || exchange.status === 'reportedByPartner') {
      return {title: 'In dispute', modifier: 'in-dispute'};
    }

    if (exchange.status === 'completed') {
      return {title: 'completed', modifier: 'completed'};
    }

    return {title: '', modifier: ''};
  }

  getHelperText(exchange, user) {
    switch (exchange.status) {
      case 'new':
        return user.data.id === exchange.partner.id ? HELPER_TEXT.incoming : HELPER_TEXT.outcoming;
      case 'accepted':
        return HELPER_TEXT.accepted;
      case 'validatedByInitiator':
        return exchange.initiator.id === user.data.id
          ? HELPER_TEXT.validatedByCurrentUser
          : HELPER_TEXT.validatedByOtherUser;
      case 'validatedByPartner':
        return exchange.partner.id === user.data.id
          ? HELPER_TEXT.validatedByCurrentUser
          : HELPER_TEXT.validatedByOtherUser;
      case 'reportedByInitiator':
      case 'reportedByPartner':
        return HELPER_TEXT.reported;
      case 'canceled':
        return HELPER_TEXT.canceled;
      case 'completed':
        return HELPER_TEXT.completed;
      case 'rejected':
        return HELPER_TEXT.rejected;
      default:
        return null;
    }
  }

  getTransactionInfo(exchange, user) {
    switch (exchange.status) {
      case 'new':
        return user.data.id === exchange.partner.id
          ? TRANSACTION_INFO.incoming
          : TRANSACTION_INFO.outcoming;
      case 'accepted':
        return TRANSACTION_INFO.accepted;
      case 'validatedByInitiator':
        return exchange.initiator.id === user.data.id
          ? TRANSACTION_INFO.validatedByCurrentUser
          : TRANSACTION_INFO.validatedByOtherUser;
      case 'validatedByPartner':
        return TRANSACTION_INFO.partner.id === user.data.id
          ? TRANSACTION_INFO.validatedByCurrentUser
          : TRANSACTION_INFO.validatedByOtherUser;
      case 'reportedByInitiator':
        return TRANSACTION_INFO.reportedByInitiator;
      case 'reportedByPartner':
        return TRANSACTION_INFO.reportedByPartner;
      default:
        return null;
    }
  }

  copyPublicKeyToClipboard() {
    clipboard.write(this.props.exchange.bcContractAddress);
  }

  handleChangeModalVisibility() {
    this.setState({
      detailsModalVisible: !this.state.detailsModalVisible
    });
  }

  handleChangeConfirmationModalVisibility(actionBtn) {
    if (actionBtn) {
      this.setState({
        confirmationActionButton: actionBtn,
        confirmationModalVisible: true
      });
    } else {
      this.setState({
        confirmationModalVisible: false
      });
    }
  }

  render() {
    const {exchange, user, showEscrow} = this.props;
    const status = this.getStatus(exchange, user);
    const transactionInfo = this.getTransactionInfo(exchange, user);
    const helpText = this.getHelperText(exchange, user);
    const currentUserId = user.data.id;

    return (
      <React.Fragment>
        <ExchangeOffer
          {...this.props}
          changeModalVisibility={this.handleChangeModalVisibility}
          openConfirmationModal={this.handleChangeConfirmationModalVisibility}
          status={status}
          helpText={helpText}
        />
        {this.state.detailsModalVisible && (
          <DetailsModal
            changeModalVisibility={this.handleChangeModalVisibility}
            status={status}
            {...this.props}>
            <div className="exchange-offer">
              <div className="exchange-offer__items-wrapper">
                {/* Initiator */}
                <div className="exchange-offer__section exchange-offer__section--initiator">
                  <h6 className="details-modal__subtitle">Offer:</h6>
                  <div className="exchange-offer__user-section">
                    <UserLink
                      user={exchange.initiator}
                      isOwner={exchange.initiator.id === currentUserId}
                    />
                  </div>
                  <div className="exchange-offer__item-section">
                    <ExchangeOfferItem
                      item={exchange.initiatorItem}
                      itemType={exchange.initiatorItemType}
                      quantity={exchange.initiatorItemQuantity}
                    />
                  </div>
                  {exchange.initiatorItemType === 'service' && (
                    <ExchangeAvailability
                      className="exchange-offer__availability-section"
                      days={exchange.initiatorItemDays}
                      time={exchange.initiatorItemTime}
                    />
                  )}
                </div>

                <div className="exchange-offer__arrow">
                  <Icon name="chevron-right" size="24" />
                </div>

                {/* Partner */}
                <div className="exchange-offer__section exchange-offer__section--partner">
                  <h6 className="details-modal__subtitle">Item for exchange:</h6>
                  <div className="exchange-offer__user-section">
                    <UserLink
                      user={exchange.partner}
                      isOwner={exchange.partner.id === currentUserId}
                    />
                  </div>

                  <div className="exchange-offer__item-section">
                    <ExchangeOfferItem
                      item={exchange.partnerItem}
                      itemType={exchange.partnerItemType}
                      quantity={exchange.partnerItemQuantity}
                    />
                  </div>

                  {exchange.partnerItemType === 'service' && (
                    <ExchangeAvailability
                      className="exchange-offer__availability-section"
                      days={exchange.partnerItemDays}
                      time={exchange.partnerItemTime}
                      prefered
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="exchange-offer__detailed-info">
              <div className="row">
                <div className="col-6">
                  <div className="exchange-offer__transaction-info">{transactionInfo}</div>
                </div>
                <div className="col-6">
                  {/* Show Escrow */}
                  {showEscrow && (
                    <div className="exchange-offer__escrow-wrapper">
                      <h6 className="details-modal__subtitle">
                        Smart Contract wallet (Public Key)
                      </h6>
                      <div className="exchange-offer__copy-key">
                        <div className="exchange-offer__public-key__wrapper">
                          <Icon name="wallet" size="20" />
                          <div className="exchange-offer__public-key">
                            <p className="exchange-offer__public-key__text">
                              {exchange.bcContractAddress}
                            </p>
                            <span>...</span>
                          </div>
                        </div>
                        <Button color="copy" onClick={this.copyPublicKeyToClipboard()}>
                          Copy
                        </Button>
                      </div>
                      <ExchangeEscrow
                        difference={calculateEscrowDifference(
                          exchange.initiatorItem.price,
                          exchange.initiatorItemQuantity,
                          exchange.partnerItem.price,
                          exchange.partnerItemQuantity
                        )}
                        escrow={calculateEscrow(
                          exchange.initiatorItem.price,
                          exchange.initiatorItemQuantity,
                          exchange.partnerItem.price,
                          exchange.partnerItemQuantity
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="exchange-offer__disclaimer">
                    <Icon className="exchange-offer__disclaimer__icon" name="information-outline" />
                    <span>{helpText}</span>
                  </div>
                </div>
              </div>
            </div>
          </DetailsModal>
        )}
        {this.state.confirmationModalVisible && (
          <ConfirmationModal
            confirmationText={
              CONFIRMATION_TEXT[this.state.confirmationActionButton.title.toLowerCase()]
            }
            closeModal={this.handleChangeConfirmationModalVisibility}
            confirmationAction={() => {
              this.state.confirmationActionButton.onClick(exchange);
            }}
            btnName={`${this.state.confirmationActionButton.title} Offer`}
            btnColor={this.state.confirmationActionButton.color}
            headerText={`${this.state.confirmationActionButton.title} Confirmation`}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ExchangeOfferWrapper;
