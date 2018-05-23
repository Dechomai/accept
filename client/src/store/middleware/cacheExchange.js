import exchangeCache from '../../services/exchangeCache';

import {
  START_NEW_EXCHANGE,
  SELECT_EXCHANGE_ITEM_TYPE,
  SELECT_EXCHANGE_ITEM,
  CHANGE_EXCHANGE_OWN_COUNT,
  CHANGE_EXCHANGE_PARTNER_COUNT,
  CHANGE_EXCHANGE_OWN_DAYS,
  CHANGE_EXCHANGE_OWN_TIME
} from '../../actions/exchange';

const actions = [
  START_NEW_EXCHANGE,
  SELECT_EXCHANGE_ITEM_TYPE,
  SELECT_EXCHANGE_ITEM,
  CHANGE_EXCHANGE_OWN_COUNT,
  CHANGE_EXCHANGE_PARTNER_COUNT,
  CHANGE_EXCHANGE_OWN_DAYS,
  CHANGE_EXCHANGE_OWN_TIME
];

const selector = state => state.exchange;

const cacheExchange = store => next => action => {
  const result = next(action);
  if (!actions.includes(action.type)) return result;
  if (action.type === START_NEW_EXCHANGE) {
    exchangeCache.reset();
  } else {
    const state = selector(store.getState());
    exchangeCache.set(state);
  }
  return result;
};

export default cacheExchange;
