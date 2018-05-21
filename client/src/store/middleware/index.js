import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import cacheExchange from './cacheExchange';

const logger = createLogger({
  duration: true,
  collapsed: true
});

const middleware = [thunk, cacheExchange];

if (ENV === 'development') middleware.push(logger);

export default middleware;
