import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

const logger = createLogger({
  duration: true,
  collapsed: true
});

const middleware = [thunk];

if (ENV === 'development') middleware.push(logger);

export default middleware;
