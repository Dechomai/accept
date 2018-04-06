import React from 'react';
import PropTypes from 'prop-types';
import {Router as ReactRouter, IndexRoute, Route, browserHistory} from 'react-router';
import autobind from 'autobindr';
import {pathOr} from 'ramda';

import {selectUserData} from './selectors';

import App from './layout/App';
import Demo from './layout/Demo';
import SignUp from './layout/SignUp';
import AddProduct from './layout/AddProduct';
import Profile from './layout/UserProfile';
import AboutMe from './containers/AboutMe/AboutMe';

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
export const redirect = (prevState, nextState, store, replace, cb) => {
  const {location} = nextState;
  const {pathname} = location;
  const state = store.getState();
  const user = selectUserData(state);

  // if user status is 'newreg' redirect to /signup
  if (pathname !== '/signup' && user && user.status === 'newreg') {
    replace('/signup');
    return cb();
  }

  // if user status is other that 'newreg' disable /signup
  if (pathname === '/signup' && (!user || (user && user.status !== 'newreg'))) {
    const prev = pathOr('/', ['location', 'pathname'], prevState);
    replace(prev);
    return cb();
  }

  // TODO: disable profile* routes for not registered users

  cb();
};

class Router extends React.Component {
  constructor() {
    super();
    autobind(this);
  }

  onRootRouteEnter(nextState, replace, cb) {
    redirect(null, nextState, this.props.store, replace, cb);
  }

  onRootRouteChange(prevState, nextState, replace, cb) {
    redirect(prevState, nextState, this.props.store, replace, cb);
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

          <Route path="signup" component={SignUp} />

          <Route path="profile" component={Profile}>
            <IndexRoute component={AboutMe} />
            <Route path="products" component={() => <h1>Profile Products</h1>} />
            <Route path="services" component={() => <h1>Profile Services</h1>} />
            <Route path="edit" component={() => <h1>Edit Profile</h1>} />
          </Route>

          <Route path="products">
            <Route path="add" component={AddProduct} />
          </Route>

          <Route path="services">
            <Route path="add" component={() => <h1>Add Service</h1>} />
          </Route>

          {/* Temp route to showcase UI kit */}
          <Route path="demo" component={Demo} />
        </Route>
      </ReactRouter>
    );
  }
}

Router.propTypes = {
  store: PropTypes.any
};

export default Router;
