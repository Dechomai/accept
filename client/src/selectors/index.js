import {createSelector} from 'reselect';
import {path} from 'ramda';

const selectUsers = state => state.users;
const selectProducts = state => state.products;
const selectProductDetails = state => state.productDetails;
const selectServices = state => state.services;
const selectExchange = state => state.exchange;
const selectServiceDetails = state => state.serviceDetails;
const selectExchanges = state => state.exchanges;

export const selectProfile = state => state.user;

export const selectUser = createSelector(
  [selectUsers, (state, userId) => userId],
  (users, userId) => users[userId]
);

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

// Services
// Own services
const selectOwnServices = createSelector(selectServices, services => services.user);
export const selectOwnServicesFor = createSelector(
  [selectOwnServices, (state, {skip, limit}) => ({skip, limit})],
  (services, {skip, limit}) => services[`skip=${skip},limit=${limit}`]
);
export const selectOwnServicesCount = createSelector(selectOwnServices, services => services.count);

// Services of specific user
export const selectUserServicesFor = createSelector(
  [selectServices, (state, {userId, skip, limit}) => ({userId, skip, limit})],
  (services, {userId, skip, limit}) => path([userId, `skip=${skip},limit=${limit}`], services)
);
export const selectUserServicesCount = createSelector(
  [selectServices, (state, userId) => userId],
  (services, userId) => path([userId, 'count'], services)
);

// All services
const selectAllServices = createSelector(selectServices, services => services.all);
export const selectAllServicesFor = createSelector(
  [selectAllServices, (state, {skip, limit}) => ({skip, limit})],
  (services, {skip, limit}) => services[`skip=${skip},limit=${limit}`]
);

export const selectServiceById = (state, serviceId) => selectServiceDetails(state)[serviceId];
export const selectAllServicesCount = createSelector(selectAllServices, services => services.count);

export const selectExchangeStep = state => selectExchange(state).step;
export const selectExchangeItemType = state => selectExchange(state).selectedType;
export const selectExchangeItemId = state => selectExchange(state).selectedItemId;
export const selectExchangeOwnCount = state => selectExchange(state).ownCount;
export const selectExchangePartnerCount = state => selectExchange(state).partnerCount;
export const selectExchangeOwnDays = state => selectExchange(state).ownDays;
export const selectExchangeOwnTime = state => selectExchange(state).ownTime;
export const selectExchangePartnerDays = state => selectExchange(state).partnerDays;
export const selectExchangePartnerTime = state => selectExchange(state).partnerTime;

export const selectExchangesFor = createSelector(
  [selectExchanges, (_, {state, skip, limit}) => ({state, skip, limit})],
  (exchanges, {state, skip, limit}) => path([state, `skip=${skip},limit=${limit}`], exchanges)
);
