export const SELECT_ITEM_TYPE = 'SELECT_ITEM_TYPE';
export const SELECT_ITEM = 'SELECT_ITEM';
export const CHANGE_OWN_COUNT = 'CHANGE_OWN_COUNT';
export const CHANGE_PARTNER_COUNT = 'CHANGE_PARTNER_COUNT';
export const CHANGE_OWN_DAYS = 'CHANGE_OWN_DAYS';
export const CHANGE_OWN_TIME = 'CHANGE_OWN_TIME';

export const selectItemType = type => ({
  type: SELECT_ITEM_TYPE,
  payload: {
    selectedType: type
  }
});

export const selectItem = item => ({
  type: SELECT_ITEM,
  payload: {
    selectedItem: item
  }
});

export const changeOwnCount = ownCount => ({
  type: CHANGE_OWN_COUNT,
  payload: {
    ownCount
  }
});

export const changePartnerCount = partnerCount => ({
  type: CHANGE_PARTNER_COUNT,
  payload: {
    partnerCount
  }
});

export const changeOwnDays = ownDays => ({
  type: CHANGE_OWN_DAYS,
  payload: {
    ownDays
  }
});

export const changeOwnTime = ownTime => ({
  type: CHANGE_OWN_TIME,
  payload: {
    ownTime
  }
});
