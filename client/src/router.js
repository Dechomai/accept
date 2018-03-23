import React from 'react';
import {Router as ReactRouter, IndexRoute, Route, browserHistory} from 'react-router';

import App from './layout/App';

/*

  / - home
  /signup - finish signup wizard

  User Profile

  /profile - user profile index
    /products - list user products
    /services - list user services
    /edit - edit user profile

  Products

  /products - all products
    /add - create new product
    /:productId - product page(will differ if created by current user)
    /:productId/edit - product edit(only available if current user created this product)

  Services

  /services - all services
    /add - create new service
    /:serviceId - service page(will differ if created by current user)
    /:serviceId/edit - service edit(only available if current user created this service)

  Users

  /users/:userId - user profile (current user can not access his page)

  TODO:
  add exchanges, notifications, etc.

*/

const Router = () => (
  <ReactRouter history={browserHistory}>
    <Route path="/" component={App}>
      {}

      <IndexRoute component={() => <h1>Home</h1>} />
      <Route path="profile" component={() => <h1>Profile</h1>}>
        <Route path="edit" component={() => <h1>Edit Profile</h1>} />
      </Route>
    </Route>
  </ReactRouter>
);

export default Router;
