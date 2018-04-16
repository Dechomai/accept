import {createSelector} from 'reselect';

const selectUser = state => state.user;
const selectProducts = state => state.products;

// User
export const selectUserStatus = createSelector(selectUser, ({loading, error}) => ({
  loading,
  error
}));
export const selectUserData = createSelector(selectUser, ({data}) => data);

// Products

// Products own
const selectOwnProducts = createSelector(selectProducts, products => products.user);
export const selectOwnProductsFor = createSelector(
  [selectOwnProducts, (state, {skip, limit}) => ({skip, limit})],
  (products, {skip, limit}) => products[`skip=${skip},limit=${limit}`]
);
export const selectOwnProductsCount = createSelector(selectOwnProducts, products => products.count);

// Products ALl
const selectAllProducts = createSelector(selectProducts, products => products.all);
export const selectAllProductsFor = createSelector(
  [selectAllProducts, (state, {skip, limit}) => ({skip, limit})],
  (products, {skip, limit}) => products[`skip=${skip},limit=${limit}`]
);
