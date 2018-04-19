import {createSelector} from 'reselect';
import {path} from 'ramda';

const selectUsers = state => state.users;
const selectProducts = state => state.products;
const selectProductDetails = state => state.productDetails;

export const selectProfile = state => state.user;

// Products
// Own products
const selectOwnProducts = createSelector(selectProducts, products => products.user);
export const selectOwnProductsFor = createSelector(
  [selectOwnProducts, (state, {skip, limit}) => ({skip, limit})],
  (products, {skip, limit}) => products[`skip=${skip},limit=${limit}`]
);
export const selectOwnProductsCount = createSelector(selectOwnProducts, products => products.count);

// Products of specific user
export const selectUserProductsFor = createSelector(
  [selectProducts, (state, {userId, skip, limit}) => ({userId, skip, limit})],
  (products, {userId, skip, limit}) => path([userId, `skip=${skip},limit=${limit}`], products)
);
export const selectUserProductsCount = createSelector(
  [selectProducts, (state, userId) => userId],
  (products, userId) => path([userId, 'count'], products)
);

// All products
const selectAllProducts = createSelector(selectProducts, products => products.all);
export const selectAllProductsFor = createSelector(
  [selectAllProducts, (state, {skip, limit}) => ({skip, limit})],
  (products, {skip, limit}) => products[`skip=${skip},limit=${limit}`]
);

export const selectProductById = (state, productId) => selectProductDetails(state)[productId];
export const selectAllProductsCount = createSelector(selectAllProducts, products => products.count);

export const selectUser = createSelector(
  [selectUsers, (state, userId) => userId],
  (users, userId) => users[userId]
);
