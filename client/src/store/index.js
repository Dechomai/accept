import {createStore, combineReducers, applyMiddleware} from 'redux';

import reducers from '../reducers';
import middleware from './middleware';

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

const rootReducer = combineReducers(reducers);

const createAppStore = (initialState = {}) => {
  const args = [rootReducer, initialState];
  if (ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__)
    args.push(window.__REDUX_DEVTOOLS_EXTENSION__());

  return createStoreWithMiddleware(...args);
};

export default createAppStore;
