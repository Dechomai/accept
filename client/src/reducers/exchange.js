import {
  SELECT_ITEM_TYPE,
  SELECT_ITEM,
  CHANGE_OWN_COUNT,
  CHANGE_PARTNER_COUNT,
  CHANGE_OWN_DAYS,
  CHANGE_OWN_TIME
} from '../actions/exchange';

const getInitialState = () => ({
  selectedType: null,
  selectedItem: null,
  ownCount: 1,
  partnerCount: 1,
  ownDays: [],
  ownTime: []
});

const exchange = (state = getInitialState(), action) => {
  switch (action.type) {
    case SELECT_ITEM_TYPE: {
      return {
        ...state,
        selectedType: action.payload.selectedType
      };
    }
    case SELECT_ITEM: {
      return {
        ...state,
        selectedItem: action.payload.selectedItem
      };
    }
    case CHANGE_OWN_COUNT: {
      return {
        ...state,
        ownCount: action.payload.ownCount
      };
    }
    case CHANGE_PARTNER_COUNT: {
      return {
        ...state,
        partnerCount: action.payload.partnerCount
      };
    }
    case CHANGE_OWN_DAYS: {
      return {
        ...state,
        ownDays: action.payload.ownDays
      };
    }
    case CHANGE_OWN_TIME: {
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
