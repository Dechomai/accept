import {createSelector} from 'reselect';

const selectUser = state => state.user;
const selectProduct = state => state.product;
const selectProducts = state => state.products;
const selectProductDetails = state => state.productDetails;

const selectOwnProducts = createSelector(selectProducts, products => products.user);
const selectAllProducts = createSelector(selectProducts, products => products.all);

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
export const selectSomeOwnProducts = createSelector(
  [selectOwnProducts, (state, skip, limit) => ({skip, limit})],
  (products, {skip, limit}) => products[`skip=${skip},limit=${limit}`]
);
export const selectAllProductsFor = createSelector(
  [selectAllProducts, (state, skip, limit) => ({skip, limit})],
  (products, {skip, limit}) => products[`skip=${skip},limit=${limit}`]
);

export const selectOwnProductById = (state, productId) => selectProductDetails(state)[productId];
