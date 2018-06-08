// const Web3 = require('web3');

const Exchange = require('../models/exchange');
const blockchainService = require('./blockchain');
const notificationsService = require('./notifications');
const {createLoggerWith} = require('../logger');

const logger = createLoggerWith('[SVC:BCSync]');

class BlockchainSyncService {
  constructor() {
    this.exchangeInitiatedEvent = null;
    this.watchingExchangeInitiatedEvent = false;
  }

  getExchangeInitiatedEvent() {
    if (this.exchangeInitiatedEvent) return Promise.resolve(this.exchangeInitiatedEvent);
    return blockchainService.getExchangeInitiatedEvent().then(event => {
      this.exchangeInitiatedEvent = event;
      return event;
    });
  }

  startWatchingExchangeInitiatedEvent() {
    if (this.watchingExchangeInitiatedEvent) return;
    return this.getExchangeInitiatedEvent().then(event => {
      logger.info('ExchangeInitiated Event observer started');
      event.watch((err, result) => {
        if (err) {
          logger.error('ExchangeInitiated Event error', err);
          return;
        }
        try {
          const {transactionHash} = result;
          const {contractAddress, initiator} = result.args;
          logger.info(
            'ExchangeInitiated Event got contractAddress: ',
            contractAddress,
            'for initiator',
            initiator,
            'txHash:',
            transactionHash
          );
          this.updateExchange({txHash: transactionHash, contractAddress});
        } catch (err) {
          logger.error('ExchangeInitiated Event handler error', err);
        }
      });
    });
  }

  updateExchange({txHash, contractAddress}) {
    Exchange.findOne({
      bcPendingTransactionHash: txHash
    })
      .then(exchange => (exchange ? exchange : Promise.reject(null)))
      .then(exchange => {
        return Exchange.findOneAndUpdate(
          {_id: exchange.id},
          {
            status: 'new',
            bcContractAddress: contractAddress,
            $unset: {bcPendingTransactionHash: true}
          },
          {
            new: true
          }
        );
      })
      .then(exchange => {
        logger.info('Updated exchange', exchange.id, 'with contract address', contractAddress);
        return notificationsService.publishNotification('Exchange.new', exchange.partner, exchange);
      })
      .catch(err => {
        if (err === null) {
          logger.error('Error updating exchange, exchange does not exists with txHash:', txHash);
        } else {
          logger.error('Error updating exchange', err);
        }
      });
  }
}

const blockchainSyncService = new BlockchainSyncService();

module.exports = blockchainSyncService;
