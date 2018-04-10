import {createSelector} from 'reselect';

const selectUser = state => state.user;
const selectProduct = state => state.product;

export const selectUserStatus = createSelector(selectUser, ({loading, error}) => ({
  loading,
  error
}));

export const selectProductStatus = createSelector(selectProduct, ({loading, error}) => ({
  loading,
  error
}));

export const selectUserData = createSelector(selectUser, ({data}) => data);
export const selectProductData = createSelector(selectProduct, ({data}) => data);
