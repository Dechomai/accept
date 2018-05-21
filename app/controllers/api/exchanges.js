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
            bcInitiatorTransactionHash: bcTransactionHash
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
      return exchanges.reduce((promise, exchange) => {
        return promise.then(() => {
          return blockchainService
            .getContractAddress(exchange.bcInitiatorTransactionHash)
            .then(address => {
              exchange.bcContractAddress = address;
              exchange.status = 'new';
              return exchange.save();
            });
        });
      }, Promise.resolve());
      // TODO: add catch, add catch for each exchange
    });
  },

  getOutcomingExchanges({userId, skip, limit}) {
    const query = {
      initiator: userId,
      status: 'new'
    };

    return this.ensureContractAddresses('initiator', userId)
      .then(() =>
        Promise.all([
          Exchange.find(query, Exchange.projection, {
            skip,
            limit,
            sort: DEFAULT_SORT
          }),
          Exchange.count(query)
        ])
      )
      .then(([exchanges, count = 0]) => {
        logger.info(
          ':getOutcomingExchanges',
          `(limit:${limit},skip:${skip}) found ${exchanges.length}, total ${count}`,
          userId && `for user ${userId}`
        );
        return {exchanges, count};
      })
      .catch(err => {
        logger.error(
          ':getOutcomingExchanges',
          `(limit:${limit},skip:${skip}) error`,
          userId && `for user ${userId}`,
          err
        );
        return Promise.reject(err);
      });
  }
};

module.exports = exchangesController;
