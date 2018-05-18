import {isEmpty} from 'ramda';

const isPresent = a => a && !isEmpty(a);

export const shouldRefetchItem = item => {
  if (!isPresent(item)) return true;
  if (item.loading) return false;
  if (isPresent(item.data) || isPresent(item.error)) return false;
  return true;
};

export const isItemLoading = item => !isPresent(item) || (item && item.loading);
