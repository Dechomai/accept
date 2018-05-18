import {path} from 'ramda';

import metamaskService from '../services/metamask';
import {calculateEscrow} from '../utils/exchange';

export const SELECT_EXCHANGE_ITEM_TYPE = 'SELECT_EXCHANGE_ITEM_TYPE';
export const SELECT_EXCHANGE_ITEM = 'SELECT_EXCHANGE_ITEM';
export const CHANGE_EXCHANGE_OWN_COUNT = 'CHANGE_EXCHANGE_OWN_COUNT';
export const CHANGE_EXCHANGE_PARTNER_COUNT = 'CHANGE_EXCHANGE_PARTNER_COUNT';
export const CHANGE_EXCHANGE_OWN_DAYS = 'CHANGE_EXCHANGE_OWN_DAYS';
export const CHANGE_EXCHANGE_OWN_TIME = 'CHANGE_EXCHANGE_OWN_TIME';
export const CREATE_EXCHANGE_CONTRACT_REQUEST = 'CREATE_EXCHANGE_CONTRACT_REQUEST';
export const CREATE_EXCHANGE_CONTRACT_SUCCESS = 'CREATE_EXCHANGE_CONTRACT_SUCCESS';
export const CREATE_EXCHANGE_CONTRACT_FAILURE = 'CREATE_EXCHANGE_CONTRACT_FAILURE';

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

export const createExchangeContractRequest = () => ({
  type: CREATE_EXCHANGE_CONTRACT_REQUEST,
  payload: {}
});

export const createExchangeContractSuccess = () => ({
  type: CREATE_EXCHANGE_CONTRACT_SUCCESS,
  payload: {}
});

export const createExchangeContractFailure = () => ({
  type: CREATE_EXCHANGE_CONTRACT_FAILURE,
  payload: {}
});

export const createExchangeContract = ({
  partnerItem,
  partnerItemCount,
  selectedItem,
  selectedItemCount
}) => dispatch => {
  dispatch(createExchangeContractRequest());

  // register window.onbeforeunload callback
  // to prevent losing transaction callback if page refreshes or browser closes

  const partnerAddress = path(['createdBy', 'bcDefaultAccountAddress'], partnerItem);
  const partnerItemData = partnerItem.data;
  const selectedItemData = selectedItem.data;
  const price = calculateEscrow(
    selectedItemData.price,
    selectedItemCount,
    partnerItemData.price,
    partnerItemCount
  );

  metamaskService
    .createExchangeContract({
      initiatorItemName: selectedItemData.title,
      initiatorItemQuantity: selectedItemCount,
      partnerItemName: partnerItemData.title,
      partnerItemQuantity: partnerItemCount,
      partnerAddress,
      price
    })
    .then(
      ([transactionHash, contractAddressPromise]) => {
        // this.setState({transactionStatus: 'accepted'});

        // publish to server
        console.log('tx', transactionHash);

        contractAddressPromise.then(address => {
          // publish address to server
          console.log('contract address', address);
        });
      },
      err => {
        console.log('err', err);
        // this.setState({transactionStatus: 'rejected'})
      }
    )
    .then(() => {
      // const step = this.getStepFromQuery();
      // this.setStepQuery(step + 1);
    });
};
