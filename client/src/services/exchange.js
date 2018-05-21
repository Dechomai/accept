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
  }
};

export default exchangeService;
