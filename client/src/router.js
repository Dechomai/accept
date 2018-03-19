import React from 'react';
import {Router as ReactRouter, IndexRoute, Route, Link, browserHistory} from 'react-router';

const Router = () => (
  <ReactRouter history={browserHistory}>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
    </nav>
    <Route
      path="/"
      component={({children}) => (
        <div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
          </nav>
          <div>{children}</div>
        </div>
      )}
    >
      <IndexRoute component={() => <h1>Home</h1>} />
      <Route path="profile" component={() => <h1>Profile</h1>} />
    </Route>
  </ReactRouter>
);

export default Router;
