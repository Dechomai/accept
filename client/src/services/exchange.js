import api from '../utils/api';

const exchangeService = {
  createExchange({
    initiatorItemId,
    initiatorItemType,
    initiatorItemQuantity,
    initiatorBcAddress,
    partnerItemId,
    partnerItemType,
    partnerItemQuantity,
    partnerBcAddress,
    partner,
    price,
    bcTransactionHash
  }) {
    return api.post('/exchanges', {
      body: {
        initiatorItemId,
        initiatorItemType,
        initiatorItemQuantity,
        initiatorBcAddress,
        partnerItemId,
        partnerItemType,
        partnerItemQuantity,
        partnerBcAddress,
        partner,
        price,
        bcTransactionHash
      }
    });
  },

  getExchanges({state, skip, limit}) {
    return api.get(`/exchanges?state=${state}&skip=${skip}&limit=${limit}`);
  },

  exchangeAction(action, {exchangeId, bcTransactionHash}) {
    return api.post(`/exchanges/${exchangeId}`, {
      body: {
        action,
        bcTransactionHash
      }
    });
  },

  cancelExchange({exchangeId, bcTransactionHash}) {
    return this.exchangeAction('cancel', {exchangeId, bcTransactionHash});
  },

  acceptExchange({exchangeId, bcTransactionHash}) {
    return this.exchangeAction('accept', {exchangeId, bcTransactionHash});
  }
};

export default exchangeService;
