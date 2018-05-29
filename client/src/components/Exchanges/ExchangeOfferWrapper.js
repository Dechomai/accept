import React from 'react';
import autobind from 'autobindr';
import {Button} from 'reactstrap';

import ExchangeOffer from './ExchangeOffer';
import DetailsModal from './DetailsModal';
import ExchangeEscrow from '../../components/Exchange/Escrow';
import {calculateEscrow, calculateEscrowDifference} from '../../utils/exchange';
import Icon from '../common/Icon/Icon';
import UserLink from '../../components/common/UserLink/UserLink';
import ExchangeOfferItem from './ExchangeOfferItem';
import ExchangeAvailability from '../Exchange/ExchangeAvailability';
import clipboard from '../../services/clipboard';

class ExchangeOfferWrapper extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      detailsModalVisible: false
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

    return {title: '', modifier: ''};
  }

  copyPublicKeyToClipboard() {
    clipboard.write(this.props.exchange.bcContractAddress);
  }

  handleChangeModalVisibility() {
    this.setState({
      detailsModalVisible: !this.state.detailsModalVisible
    });
  }

  render() {
    const {exchange, user, showEscrow} = this.props;
    const status = this.getStatus(exchange, user);
    const currentUserId = user.data.id;

    return (
      <React.Fragment>
        <ExchangeOffer
          {...this.props}
          changeModalVisibility={this.handleChangeModalVisibility}
          status={status}
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
                  <div className="exchange-offer__transaction-info">
                    <p>
                      <strong>
                        The value of your exchange will be deducted from your Accept wallet and
                        escrowed in the transaction’s smart contract wallet
                      </strong>{' '}
                      [Public key].
                    </p>
                    <p>
                      If there is a difference in listing values between the items being exchanged,{' '}
                      <strong>the lowest amount will be set as the transaction value</strong>, and
                      will be escrowed by both parties.
                    </p>
                    <p>
                      Your <strong>escrowed funds will be returned</strong> to your Accept wallet{' '}
                      <strong>after both parties validate</strong> that the transaction has
                      successfully completed, and feedback has been provided.
                    </p>
                    <p>
                      If either buyer or seller{' '}
                      <strong>does not the validate the transaction</strong>, a transaction dispute
                      will be initiated, and the funds will remain in escrow pending the decision of
                      an Accept Star Council.
                    </p>
                  </div>
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
                    <span>
                      By accepting this offer, I agree to the Accept.IO marketplace rules, and in
                      the event of a transaction dispute, I agree to be bound by the Accept Star
                      Council rules of arbitration and any decision made as a result of this
                      arbitration process.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DetailsModal>
        )}
      </React.Fragment>
    );
  }
}

export default ExchangeOfferWrapper;
