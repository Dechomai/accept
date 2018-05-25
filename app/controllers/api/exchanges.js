const Exchange = require('../../models/exchange');
const User = require('../../models/user');
const Product = require('../../models/product');
const Service = require('../../models/service');
const {createLoggerWith} = require('../../logger');
const blockchainService = require('../../services/blockchain');

const logger = createLoggerWith('[CTRL:Exchanges]');

const MODELS = {
  product: Product,
  service: Service
};

const DEFAULT_SORT = {
  createdAt: -1
};

const exchangesController = {
  createExchange({
    initiator,
    partner,
    initiatorItemId,
    initiatorItemType,
    initiatorItemQuantity,
    initiatorBcAddress,
    partnerItemId,
    partnerItemType,
    partnerItemQuantity,
    partnerBcAddress,
    price,
    bcTransactionHash
  }) {
    return (
      Promise.all([
        User.findById(initiator),
        User.findById(partner),
        MODELS[initiatorItemType].findById(initiatorItemId),
        MODELS[partnerItemType].findById(partnerItemId)
      ])
        // check if entities exist
        .then(([initiatorUser, partnerUser, initiatorItem, partnerItem]) => {
          if (partnerUser === null) {
            logger.error(`Partner ${partnerUser} not found`);
            return Promise.reject('Can not find user');
          }
          if (initiatorItem === null) {
            logger.error(`${initiatorItemType} ${initiatorItemId} not found`);
            return Promise.reject('Can not find product/service');
          }
          if (partnerItem === null) {
            logger.error(`${partnerItemType} ${partnerItemId} not found`);
            return Promise.reject('Can not find product/service');
          }
          if (initiatorUser.bcDefaultAccountAddress !== initiatorBcAddress) {
            logger.error(
              `Provided initiator address ${initiatorBcAddress} differs from one stored in DB`
            );
            return Promise.reject('Invalid initiator account address provided');
          }
          if (partnerUser.bcDefaultAccountAddress !== partnerBcAddress) {
            logger.error(
              `Provided partner address ${partnerBcAddress} differs from one stored in DB`
            );
            return Promise.reject('Invalid partner account address provided');
          }
          return [
            initiatorUser.toJSON(),
            partnerUser.toJSON(),
            initiatorItem.toJSON(),
            partnerItem.toJSON()
          ];
        })
        // check ownership
        .then(args => {
          const [initiator, partner, initiatorItem, partnerItem] = args;
          if (initiatorItem.createdBy !== initiator.id) {
            logger.error(`${initiatorItem.id} is not created by ${initiator.id}`);
            return Promise.reject('Product/service not owned by user');
          }
          if (partnerItem.createdBy !== partner.id) {
            logger.error(`${partnerItem.id} is not created by ${partner.id}`);
            return Promise.reject('Product/service not owned by user');
          }
          return args;
        })
        // check if price calculated properly
        .then(([initiator, partner, initiatorItem, partnerItem]) => {
          const validPrice = Math.min(
            initiatorItem.price * initiatorItemQuantity,
            partnerItem.price * partnerItemQuantity
          );

          if (parseFloat(price, 10).toFixed(2) !== validPrice.toFixed(2)) {
            logger.error('Invalid price provided');
            return Promise.reject('Invalid price provided');
          }
          return [initiator, partner, initiatorItem, partnerItem];
        })
        // create exchange
        .then(([initiator, partner, initiatorItem, partnerItem]) => {
          return Exchange.create({
            status: 'submitted',
            initiator: initiator.id,
            partner: partner.id,
            initiatorItemType,
            initiatorItemQuantity,
            initiatorItem, // whole JSON
            partnerItemType,
            partnerItemQuantity,
            partnerItem, // whole JSON
            price: parseFloat(price.toFixed(2), 10),
            bcPendingTransactionHash: bcTransactionHash
          });
        })
        .then(exchange => exchange.toJSON())
    );
  },

  ensureContractAddresses(userType, userId) {
    if (userType !== 'initiator' && userType !== 'partner')
      return Promise.reject('Invalid user type');

    return Exchange.find({
      [userType]: userId,
      status: 'submitted'
    }).then(exchanges => {
      if (!exchanges.length) return Promise.resolve();

      return Promise.all(
        exchanges.map(exchange =>
          blockchainService.getContractAddress(exchange.bcPendingTransactionHash).then(
            address => {
              logger.info(
                ':ensureContractAddresses',
                'contract address found',
                address,
                'for txHash',
                exchange.bcPendingTransactionHash
              );
              return Exchange.updateOne(
                {_id: exchange.id},
                {
                  status: 'new',
                  bcContractAddress: address,
                  $unset: {bcPendingTransactionHash: true}
                }
              );
            },
            err => {
              if (err === null) {
                logger.error(
                  ':ensureContractAddresses',
                  'contract address not found for tx:',
                  exchange.bcPendingTransactionHash
                );
              } else {
                logger.error(
                  ':ensureContractAddresses',
                  'error retirieving contract address for tx:',
                  exchange.bcPendingTransactionHash,
                  'error',
                  err
                );
              }
            }
          )
        )
      );
    });
  },

  resolvePendingTransactions(userType, userId) {
    if (userType !== 'initiator' && userType !== 'partner')
      return Promise.reject('Invalid user type');

    return Exchange.find({
      [userType]: userId,
      bcPendingTransactionHash: {$exists: true}
    }).then(exchanges => {
      if (!exchanges.length) return Promise.resolve();

      return Promise.all(
        exchanges.map(exchange =>
          blockchainService.getTransaction(exchange.bcPendingTransactionHash).then(
            (/* transactionReceipt */) => {
              logger.info(':resolvePendingTransactions', '');
              logger.info(
                ':resolvePendingTransactions',
                'transaction found for txHash',
                exchange.bcPendingTransactionHash
              );
              return Exchange.updateOne(
                {_id: exchange.id},
                {$unset: {bcPendingTransactionHash: true}}
              );
            },
            err => {
              if (err === null) {
                logger.error(
                  ':resolvePendingTransactions',
                  'contract address not found for tx:',
                  exchange.bcPendingTransactionHash
                );
              } else {
                logger.error(
                  ':resolvePendingTransactions',
                  'error retirieving contract address for tx:',
                  exchange.bcPendingTransactionHash,
                  'error',
                  err
                );
              }
            }
          )
        )
      );
    });
  },

  getExchanges(query, waitPromise = Promise.resolve(), {userId}, {skip, limit, loggerPrefix}) {
    return waitPromise
      .then(() =>
        Promise.all([
          Exchange.find(query, Exchange.projection, {
            skip,
            limit,
            sort: DEFAULT_SORT
          })
            .populate('initiator', User.projection)
            .populate('partner', User.projection),
          Exchange.count(query)
        ])
      )
      .then(([exchanges, count = 0]) => {
        logger.info(
          loggerPrefix,
          `(limit:${limit},skip:${skip}) found ${exchanges.length}, total ${count}`,
          userId && `for user ${userId}`
        );
        return {exchanges, count};
      })
      .catch(err => {
        logger.error(
          loggerPrefix,
          `(limit:${limit},skip:${skip}) error`,
          userId && `for user ${userId}`,
          err
        );
        return Promise.reject(err);
      });
  },

  getOutcomingExchanges({userId, skip, limit}) {
    const query = {
      initiator: userId,
      status: 'new'
    };

    return this.getExchanges(
      query,
      this.ensureContractAddresses('initiator', userId),
      {userId},
      {skip, limit, loggerPrefix: ':getOutcomingExchanges'}
    );
  },

  getIncomingExchanges({userId, skip, limit}) {
    const query = {
      partner: userId,
      status: 'new'
    };

    return this.getExchanges(
      query,
      this.ensureContractAddresses('partner', userId),
      {userId},
      {skip, limit, loggerPrefix: ':getIncomingExchanges'}
    );
  },

  getPendingExchanges({userId, skip, limit}) {
    const query = {
      $or: [
        {
          $and: [
            {
              $or: [{initiator: userId}, {partner: userId}]
            },
            {
              $or: [
                {status: 'accepted'},
                {status: 'validatedByInitiator'},
                {status: 'validatedByPartner'}
              ]
            }
          ]
        }
      ]
    };

    return this.getExchanges(
      query,
      this.ensureContractAddresses('partner', userId),
      {userId},
      {skip, limit, loggerPrefix: ':getPendingExchanges'}
    );
  },

  getReportedExchanges({userId, skip, limit}) {
    const query = {
      $or: [
        {
          $and: [
            {
              $or: [{initiator: userId}, {partner: userId}]
            },
            {
              $or: [{status: 'reportedByInitiator'}, {status: 'reportedByPartner'}]
            }
          ]
        }
      ]
    };

    return this.getExchanges(
      query,
      this.ensureContractAddresses('partner', userId),
      {userId},
      {skip, limit, loggerPrefix: ':getPendingExchanges'}
    );
  },

  getArchivedExchanges({userId, skip, limit}) {
    const query = {
      $or: [
        // canceled by initiator
        {initiator: userId, status: 'canceled'},

        // is rejected or completed
        {
          $and: [
            {
              $or: [{initiator: userId}, {partner: userId}]
            },
            {
              $or: [{status: 'rejected'}, {status: 'completed'}]
            }
          ]
        }
      ]
    };

    return this.getExchanges(
      query,
      this.ensureContractAddresses('partner', userId),
      {userId},
      {skip, limit, loggerPrefix: ':getArchivedExchanges'}
    );
  },

  cancelExchange({userId, exchangeId, txHash}) {
    return Promise.all([
      this.ensureContractAddresses('initiator', userId),
      this.resolvePendingTransactions('initiator', userId)
    ])
      .then(() => Exchange.findById(exchangeId))
      .then(exchange => (exchange ? exchange : Promise.reject(null)))
      .then(exchange => {
        if (exchange.bcPendingTransactionHash) {
          logger.error(
            `Exchange ${exchangeId} has pending transaction ${exchange.bcPendingTransactionHash}`
          );
          return Promise.reject('Exchange has pending transaction');
        }
        if (exchange.status !== 'new') {
          logger.error(`Exchange ${exchangeId} does not have status new`);
          return Promise.reject('Exchange can not be canceled');
        }
        if (exchange.initiator !== userId) {
          logger.error(`User ${userId} is not initiator of exchange ${exchangeId}`);
          return Promise.reject('User can not cancel exchange');
        }
        exchange.set('status', 'canceled');
        exchange.set('bcPendingTransactionHash', txHash);
        return exchange.save();
      });
  },

  acceptExchange({userId, exchangeId, txHash}) {
    return Promise.all([
      this.ensureContractAddresses('partner', userId),
      this.resolvePendingTransactions('partner', userId)
    ])
      .then(() => Exchange.findById(exchangeId))
      .then(exchange => (exchange ? exchange : Promise.reject(null)))
      .then(exchange => {
        if (exchange.bcPendingTransactionHash) {
          logger.error(
            `Exchange ${exchangeId} has pending transaction ${exchange.bcPendingTransactionHash}`
          );
          return Promise.reject('Exchange has pending transaction');
        }
        if (exchange.status !== 'new') {
          logger.error(`Exchange ${exchangeId} does not have status new`);
          return Promise.reject('Exchange can not be accepted');
        }
        if (exchange.partner !== userId) {
          logger.error(`User ${userId} is not partner of exchange ${exchangeId}`);
          return Promise.reject('User can not cancel exchange');
        }
        exchange.set('status', 'accepted');
        exchange.set('bcPendingTransactionHash', txHash);
        return exchange.save();
      });
  },

  rejectExchange({userId, exchangeId, txHash}) {
    return Promise.all([
      this.ensureContractAddresses('partner', userId),
      this.resolvePendingTransactions('partner', userId)
    ])
      .then(() => Exchange.findById(exchangeId))
      .then(exchange => (exchange ? exchange : Promise.reject(null)))
      .then(exchange => {
        if (exchange.bcPendingTransactionHash) {
          logger.error(
            `Exchange ${exchangeId} has pending transaction ${exchange.bcPendingTransactionHash}`
          );
          return Promise.reject('Exchange has pending transaction');
        }
        if (exchange.status !== 'new') {
          logger.error(`Exchange ${exchangeId} does not have status new`);
          return Promise.reject('Exchange can not be rejected');
        }
        if (exchange.partner !== userId) {
          logger.error(`User ${userId} is not partner of exchange ${exchangeId}`);
          return Promise.reject('User can not reject exchange');
        }
        exchange.set('status', 'rejected');
        exchange.set('bcPendingTransactionHash', txHash);
        return exchange.save();
      });
  }
};

module.exports = exchangesController;
