import api from '../utils/api';

const exchangeService = {
  createExchange({
    initiatorItemId,
    initiatorItemType,
    initiatorItemQuantity,
    partnerItemId,
    partnerItemType,
    partnerItemQuantity,
    partner,
    price,
    bcTransactionHash
  }) {
    return api.post('/exchanges', {
      body: {
        initiatorItemId,
        initiatorItemType,
        initiatorItemQuantity,
        partnerItemId,
        partnerItemType,
        partnerItemQuantity,
        partner,
        price,
        bcTransactionHash
      }
    });
  },

  getExchanges({state, skip, limit}) {
    return api.get(`/exchanges?state=${state}&skip=${skip}&limit=${limit}`);
  }
};

export default exchangeService;
