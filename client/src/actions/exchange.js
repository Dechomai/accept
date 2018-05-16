export const SELECT_EXCHANGE_ITEM_TYPE = 'SELECT_EXCHANGE_ITEM_TYPE';
export const SELECT_EXCHANGE_ITEM = 'SELECT_EXCHANGE_ITEM';
export const CHANGE_EXCHANGE_OWN_COUNT = 'CHANGE_EXCHANGE_OWN_COUNT';
export const CHANGE_EXCHANGE_PARTNER_COUNT = 'CHANGE_EXCHANGE_PARTNER_COUNT';
export const CHANGE_EXCHANGE_OWN_DAYS = 'CHANGE_EXCHANGE_OWN_DAYS';
export const CHANGE_EXCHANGE_OWN_TIME = 'CHANGE_EXCHANGE_OWN_TIME';

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
