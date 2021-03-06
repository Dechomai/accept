const Exchange = require('../../models/exchange');
const User = require('../../models/user');
const Product = require('../../models/product');
const Service = require('../../models/service');
const {createLoggerWith} = require('../../logger');
const blockchainService = require('../../services/blockchain');
const notificationsService = require('../../services/notifications');

const logger = createLoggerWith('[CTRL:Exchanges]');

const MODELS = {
  product: Product,
  service: Service
};

const DEFAULT_SORT = {
  updatedAt: -1
};

const exchangesController = {
  createExchange({
    initiator,
    partner,
    initiatorItemId,
    initiatorItemType,
    initiatorItemQuantity,
    initiatorItemDays,
    initiatorItemTime,
    initiatorBcAddress,
    partnerItemId,
    partnerItemType,
    partnerItemQuantity,
    partnerItemDays,
    partnerItemTime,
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
            initiatorItemDays,
            initiatorItemTime,
            initiatorItem, // whole JSON
            partnerItemType,
            partnerItemQuantity,
            partnerItemDays,
            partnerItemTime,
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
              return Exchange.findOneAndUpdate(
                {_id: exchange.id},
                {
                  status: 'new',
                  bcContractAddress: address,
                  $unset: {bcPendingTransactionHash: true}
                },
                {
                  new: true
                }
              ).then(exchange => {
                return notificationsService.publishNotification(
                  'Exchange.new',
                  exchange.partner,
                  exchange
                );
              });
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

  resolvePendingTransactions(userId, userType) {
    if (typeof userType !== 'undefined' && userType !== 'initiator' && userType !== 'partner')
      return Promise.reject('Invalid user type');
    let query;

    if (userType) {
      query = {[userType]: userId};
    } else {
      query = {$or: [{initiator: userId}, {partner: userId}]};
    }

    return Exchange.find({
      ...query,
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
                  'transaction not found for txHash:',
                  exchange.bcPendingTransactionHash
                );
              } else {
                logger.error(
                  ':resolvePendingTransactions',
                  'error retirieving transaction for txHash:',
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
      status: 'new',
      bcContractAddress: {$exists: true}
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
      status: 'new',
      bcContractAddress: {$exists: true}
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
      ],
      bcContractAddress: {$exists: true}
    };

    return this.getExchanges(
      query,
      this.resolvePendingTransactions(userId),
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
      ],
      bcContractAddress: {$exists: true}
    };

    return this.getExchanges(
      query,
      this.resolvePendingTransactions(userId),
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
      ],
      bcContractAddress: {$exists: true}
    };

    return this.getExchanges(
      query,
      this.resolvePendingTransactions(userId),
      {userId},
      {skip, limit, loggerPrefix: ':getArchivedExchanges'}
    );
  },

  cancelExchange({userId, exchangeId, txHash}) {
    return this.resolvePendingTransactions(userId)
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
    return this.resolvePendingTransactions(userId)
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
      })
      .then(exchange => {
        notificationsService.publishNotification('Exchange.accepted', exchange.initiator, exchange);
        return exchange;
      });
  },

  rejectExchange({userId, exchangeId, txHash}) {
    return this.resolvePendingTransactions(userId)
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
      })
      .then(exchange => {
        notificationsService.publishNotification('Exchange.rejected', exchange.initiator, exchange);
        return exchange;
      });
  },

  validateExchange({userId, exchangeId, txHash}) {
    return this.resolvePendingTransactions(userId)
      .then(() => Exchange.findById(exchangeId))
      .then(exchange => (exchange ? exchange : Promise.reject(null)))
      .then(exchange => {
        if (exchange.bcPendingTransactionHash) {
          logger.error(
            `Exchange ${exchangeId} has pending transaction ${exchange.bcPendingTransactionHash}`
          );
          return Promise.reject('Exchange has pending transaction');
        }
        const isInitiator = exchange.initiator === userId;
        const isPartner = exchange.partner === userId;
        const status = exchange.status;
        let newStatus = null;

        if (!isInitiator && !isPartner) {
          logger.error(`User ${userId} is not part of exchange ${exchangeId}`);
          return Promise.reject('User can not validate exchange');
        }

        // user is first one to validate
        if (isInitiator && status === 'accepted') {
          newStatus = 'validatedByInitiator';
        }
        if (isPartner && status === 'accepted') {
          newStatus = 'validatedByPartner';
        }

        // user is second one to validate
        if (isInitiator && status === 'validatedByPartner') {
          newStatus = 'completed';
        }
        if (isPartner && status === 'validatedByInitiator') {
          newStatus = 'completed';
        }

        if (newStatus) {
          exchange.set('status', newStatus);
          exchange.set('bcPendingTransactionHash', txHash);
          return exchange.save().then(exchange => {
            notificationsService.publishNotification(
              'Exchange.validated',
              isPartner ? exchange.initiator : exchange.partner,
              exchange
            );
          });
        }
        return Promise.reject('User can not validate exchange and its state');
      });
  },

  reportExchange({userId, exchangeId, txHash}) {
    return this.resolvePendingTransactions(userId)
      .then(() => Exchange.findById(exchangeId))
      .then(exchange => (exchange ? exchange : Promise.reject(null)))
      .then(exchange => {
        if (exchange.bcPendingTransactionHash) {
          logger.error(
            `Exchange ${exchangeId} has pending transaction ${exchange.bcPendingTransactionHash}`
          );
          return Promise.reject('Exchange has pending transaction');
        }
        const isInitiator = exchange.initiator === userId;
        const isPartner = exchange.partner === userId;
        const status = exchange.status;
        let newStatus = null;

        if (!isInitiator && !isPartner) {
          logger.error(`User ${userId} is not part of exchange ${exchangeId}`);
          return Promise.reject('User can not report exchange');
        }

        if (isInitiator && (status === 'accepted' || status === 'validatedByPartner')) {
          newStatus = 'reportedByInitiator';
        }
        if (isPartner && (status === 'accepted' || status === 'validatedByInitiator')) {
          newStatus = 'reportedByPartner';
        }

        if (newStatus) {
          exchange.set('status', newStatus);
          exchange.set('bcPendingTransactionHash', txHash);
          return exchange.save().then(exchange => {
            notificationsService.publishNotification(
              'Exchange.reported',
              isPartner ? exchange.initiator : exchange.partner,
              exchange
            );
          });
        }
        logger.error(`User can not report exhange ${exchangeId}, it has "${status}" status`);
        return Promise.reject('User can not report exchange and its state');
      });
  }
};

module.exports = exchangesController;
