import {path} from 'ramda';

import {calculateEscrow} from '../utils/exchange';
import metamaskService from '../services/metamask';
import exchangeService from '../services/exchange';

export const START_NEW_EXCHANGE = 'START_NEW_EXCHANGE';
export const CANCEL_EXCHANGE = 'CANCEL_EXCHANGE';
export const SELECT_EXCHANGE_ITEM_TYPE = 'SELECT_EXCHANGE_ITEM_TYPE';
export const SELECT_EXCHANGE_ITEM = 'SELECT_EXCHANGE_ITEM';
export const CHANGE_EXCHANGE_STEP = 'CHANGE_EXCHANGE_STEP';
export const CHANGE_EXCHANGE_OWN_COUNT = 'CHANGE_EXCHANGE_OWN_COUNT';
export const CHANGE_EXCHANGE_PARTNER_COUNT = 'CHANGE_EXCHANGE_PARTNER_COUNT';
export const CHANGE_EXCHANGE_OWN_DAYS = 'CHANGE_EXCHANGE_OWN_DAYS';
export const CHANGE_EXCHANGE_OWN_TIME = 'CHANGE_EXCHANGE_OWN_TIME';
export const CHANGE_EXCHANGE_PARTNER_DAYS = 'CHANGE_EXCHANGE_PARTNER_DAYS';
export const CHANGE_EXCHANGE_PARTNER_TIME = 'CHANGE_EXCHANGE_PARTNER_TIME';
export const CREATE_EXCHANGE_CONTRACT_REQUEST = 'CREATE_EXCHANGE_CONTRACT_REQUEST';
export const CREATE_EXCHANGE_CONTRACT_SUCCESS = 'CREATE_EXCHANGE_CONTRACT_SUCCESS';
export const CREATE_EXCHANGE_CONTRACT_FAILURE = 'CREATE_EXCHANGE_CONTRACT_FAILURE';

export const startNewExchange = () => ({
  type: START_NEW_EXCHANGE,
  payload: {}
});

export const cancelExchange = () => ({
  type: CANCEL_EXCHANGE,
  payload: {}
});

export const selectItemType = type => ({
  type: SELECT_EXCHANGE_ITEM_TYPE,
  payload: {
    selectedType: type
  }
});

export const selectItem = item => ({
  type: SELECT_EXCHANGE_ITEM,
  payload: {
    selectedItemId: item.id
  }
});

export const changeStep = step => ({
  type: CHANGE_EXCHANGE_STEP,
  payload: {
    step
  }
});

export const changeOwnCount = ownCount => ({
  type: CHANGE_EXCHANGE_OWN_COUNT,
  payload: {
    ownCount
  }
});

export const changePartnerCount = partnerCount => ({
  type: CHANGE_EXCHANGE_PARTNER_COUNT,
  payload: {
    partnerCount
  }
});

export const changeOwnDays = ownDays => ({
  type: CHANGE_EXCHANGE_OWN_DAYS,
  payload: {
    ownDays
  }
});

export const changeOwnTime = ownTime => ({
  type: CHANGE_EXCHANGE_OWN_TIME,
  payload: {
    ownTime
  }
});

export const changePartnerDays = partnerDays => ({
  type: CHANGE_EXCHANGE_PARTNER_DAYS,
  payload: {
    partnerDays
  }
});

export const changePartnerTime = partnerTime => ({
  type: CHANGE_EXCHANGE_PARTNER_TIME,
  payload: {
    partnerTime
  }
});

export const createExchangeContractRequest = () => ({
  type: CREATE_EXCHANGE_CONTRACT_REQUEST,
  payload: {}
});

export const createExchangeContractSuccess = () => ({
  type: CREATE_EXCHANGE_CONTRACT_SUCCESS,
  payload: {}
});

export const createExchangeContractFailure = err => ({
  type: CREATE_EXCHANGE_CONTRACT_FAILURE,
  payload: {
    error: err
  }
});

export const createExchangeContract = ({
  partnerItem,
  partnerItemType,
  partnerItemCount,
  selectedItem,
  selectedItemType,
  selectedItemCount
}) => dispatch => {
  dispatch(createExchangeContractRequest());

  // register window.onbeforeunload callback
  // to prevent losing transaction callback if page refreshes or browser closes

  const partnerItemData = partnerItem.data;
  const selectedItemData = selectedItem.data;
  const getBcAddress = path(['createdBy', 'bcDefaultAccountAddress']);
  const initiatorAddress = getBcAddress(selectedItemData);
  const partnerAddress = getBcAddress(partnerItemData);
  const price = parseFloat(
    calculateEscrow(
      selectedItemData.price,
      selectedItemCount,
      partnerItemData.price,
      partnerItemCount
    ).toFixed(2),
    10
  );

  return metamaskService
    .createExchangeContract({
      initiatorItemName: selectedItemData.title,
      initiatorItemQuantity: selectedItemCount,
      partnerItemName: partnerItemData.title,
      partnerItemQuantity: partnerItemCount,
      partnerAddress,
      price
    })
    .then(
      ([transactionHash /* contractAddressPromise */]) => {
        return exchangeService
          .createExchange({
            initiatorItemId: selectedItemData.id,
            initiatorItemType: selectedItemType,
            initiatorItemQuantity: selectedItemCount,
            initiatorBcAddress: initiatorAddress,
            partnerItemId: partnerItemData.id,
            partnerItemType: partnerItemType,
            partnerItemQuantity: partnerItemCount,
            partnerBcAddress: partnerAddress,
            partner: partnerItemData.createdBy.id,
            bcTransactionHash: transactionHash,
            price
          })
          .then(
            exchange => dispatch(createExchangeContractSuccess(exchange)),
            err => {
              dispatch(createExchangeContractFailure(err));
              return Promise.reject(err);
            }
          );

        // // can wait for contract address promise
        // contractAddressPromise.then(address => {
        //   // publish address to server
        //   console.log('contract address', address);
        // });
      },
      err => {
        let error = err;

        if (/(User\sdenied|cancelTransaction)/.test(err)) {
          error = 'rejected';
        }
        dispatch(createExchangeContractFailure(error));
        return Promise.reject(error);
      }
    );
};
