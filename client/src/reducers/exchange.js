import {
  SELECT_EXCHANGE_ITEM_TYPE,
  SELECT_EXCHANGE_ITEM,
  CHANGE_EXCHANGE_OWN_COUNT,
  CHANGE_EXCHANGE_PARTNER_COUNT,
  CHANGE_EXCHANGE_OWN_DAYS,
  CHANGE_EXCHANGE_OWN_TIME
} from '../actions/exchange';

const getInitialState = () => ({
  selectedType: null,
  selectedItemId: null,
  ownCount: 1,
  partnerCount: 1,
  ownDays: [],
  ownTime: []
});

const exchange = (state = getInitialState(), action) => {
  switch (action.type) {
    case SELECT_EXCHANGE_ITEM_TYPE: {
      return {
        ...state,
        selectedType: action.payload.selectedType
      };
    }
    case SELECT_EXCHANGE_ITEM: {
      return {
        ...state,
        selectedItemId: action.payload.selectedItemId
      };
    }
    case CHANGE_EXCHANGE_OWN_COUNT: {
      return {
        ...state,
        ownCount: action.payload.ownCount
      };
    }
    case CHANGE_EXCHANGE_PARTNER_COUNT: {
      return {
        ...state,
        partnerCount: action.payload.partnerCount
      };
    }
    case CHANGE_EXCHANGE_OWN_DAYS: {
      return {
        ...state,
        ownDays: action.payload.ownDays
      };
    }
    case CHANGE_EXCHANGE_OWN_TIME: {
      return {
        ...state,
        ownTime: action.payload.ownTime
      };
    }
    default: {
      return state;
    }
  }
};

export default exchange;
