export const SELECT_ITEM_TYPE = 'SELECT_ITEM_TYPE';

export const selectItemType = type => ({
  type: SELECT_ITEM_TYPE,
  payload: {
    selectedType: type
  }
});
