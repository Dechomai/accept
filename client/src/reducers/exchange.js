import {SELECT_ITEM_TYPE} from '../actions/exchange';

const getInitialState = () => ({
  selectedType: null
});

const exchange = (state = getInitialState(), action) => {
  switch (action.type) {
    case SELECT_ITEM_TYPE: {
      return {
        ...state,
        selectedType: action.payload.selectedType
      };
    }
    default: {
      return state;
    }
  }
};

export default exchange;
