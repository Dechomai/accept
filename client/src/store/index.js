import {createStore, combineReducers, applyMiddleware} from 'redux';

import reducers from '../reducers';
import middleware from './middleware';

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

const rootReducer = combineReducers(reducers);

const createAppStore = (initialState = {}) => createStoreWithMiddleware(rootReducer, initialState);

export default createAppStore;
