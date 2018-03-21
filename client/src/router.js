import React from 'react';
import {Router as ReactRouter, IndexRoute, Route, browserHistory} from 'react-router';

import App from './layout/App';

const Router = () => (
  <ReactRouter history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={() => <h1>Home</h1>} />
      <Route path="profile" component={() => <h1>Profile</h1>} />
    </Route>
  </ReactRouter>
);

export default Router;
