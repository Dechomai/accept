import {createStore, combineReducers, applyMiddleware} from 'redux';

import reducers from '../reducers';
import middleware from './middleware';

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

const rootReducer = combineReducers(reducers);

const createAppStore = (initialState = {}) =>
  createStoreWithMiddleware(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

export default createAppStore;
