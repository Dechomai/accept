import React from 'react';
import {Router as ReactRouter, IndexRoute, Route, browserHistory} from 'react-router';

import App from './layout/App';
import Demo from './layout/Demo';

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
  add exchanges|offers, notifications, etc.

*/

// perform derirects on router changes
export const redirect = (prevState, nextState, replace, cb) => {
  // eg.
  // const {location} = nextState;
  // const {pathname} = location;

  // if (someCondition && pathname !== '/whatever') {
  //   replace('/whatever');
  //   cb();
  //   return;
  // }

  cb();
};

class Router extends React.Component {
  onRootRouteEnter(nextState, replace, cb) {
    redirect(null, nextState, replace, cb);
  }

  onRootRouteChange(prevState, nextState, replace, cb) {
    redirect(prevState, nextState, replace, cb);
  }
  render() {
    return (
      <ReactRouter history={browserHistory}>
        <Route
          path="/"
          component={App}
          onEnter={this.onRootRouteEnter}
          onChange={this.onRootRouteChange}>
          <IndexRoute component={() => <h1>Home</h1>} />
          <Route path="profile" component={() => <h1>Profile</h1>}>
            <Route path="edit" component={() => <h1>Edit Profile</h1>} />
          </Route>
          {/* Temp route to showcase UI kit */}
          <Route path="demo" component={Demo} />
        </Route>
      </ReactRouter>
    );
  }
}

export default Router;
