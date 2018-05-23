import React from 'react';
import PropTypes from 'prop-types';
import {
  Router as ReactRouter,
  IndexRoute,
  Route,
  Redirect,
  IndexRedirect,
  browserHistory
} from 'react-router';
import autobind from 'autobindr';
import {prop, pathOr} from 'ramda';

import {selectProfile} from './selectors';

import App from './layout/App';
import Home from './layout/Home';
import SignUpStep2 from './layout/SignUpStep2';
import SignUpStep3 from './layout/SignUpStep3';
import Profile from './layout/UserProfile';
import AboutMe from './containers/Profile/About';
import AddProduct from './layout/AddProduct';
import AddService from './layout/AddService';
import EditProduct from './layout/EditProduct';
import EditService from './layout/EditService';
import AllProducts from './layout/AllProducts';
import AllServices from './layout/AllServices';
import ProfileProducts from './containers/Profile/Products';
import ProfileServices from './containers/Profile/Services';
import ProductDetails from './containers/Product/Details';
import ServiceDetails from './containers/Service/Details';
import Exchanges from './layout/Exchanges';
import ExchangesOutcoming from './containers/Exchanges/Outcoming';
import ExchangesIncoming from './containers/Exchanges/Incoming';

/*

  / - home
  /signup-finish - finish signup-finish wizard

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

const authorizedRoutes = [
  {pattern: /\/profile/, redirectTo: '/'},
  {pattern: /\/products\/add/, redirectTo: '/'},
  {pattern: /\/products\/.+\/edit/, redirectTo: '/'},
  {pattern: /\/services\/add/, redirectTo: '/'},
  {pattern: /\/services\/.+\/edit/, redirectTo: '/'}
];

// perform redirects on router changes
export const redirect = (prevState, nextState, store, replace, cb) => {
  const {location} = nextState;
  const {pathname} = location;
  const state = store.getState();
  const user = prop('data', selectProfile(state));

  // if user status is 'newreg' redirect to /signup-step2
  if (pathname !== '/signup-step2' && user && user.status === 'newreg') {
    replace('/signup-step2');
    return cb();
  }

  // if user status is 'pending' redirect to /signup-step3
  if (pathname !== '/signup-step3' && user && user.status === 'pending') {
    replace('/signup-step3');
    return cb();
  }

  // if user status is other that 'newreg' disable /signup-step2
  if (pathname === '/signup-step2' && (!user || (user && user.status !== 'newreg'))) {
    const prev = pathOr('/', ['location', 'pathname'], prevState);
    replace(prev);
    return cb();
  }

  // if user status is other that 'pending' disable /signup-step3
  if (pathname === '/signup-step3' && (!user || (user && user.status !== 'pending'))) {
    const prev = pathOr('/', ['location', 'pathname'], prevState);
    replace(prev);
    return cb();
  }

  const authRoute = authorizedRoutes.find(route => pathname.match(route.pattern));
  if (!user && authRoute) {
    replace(authRoute.redirectTo);
  }

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
          <IndexRoute component={Home} />

          <Route path="signup-step2" component={SignUpStep2} showFooter={false} />
          <Route path="signup-step3" component={SignUpStep3} showFooter={false} />

          <Route path="profile" component={Profile}>
            <IndexRoute component={AboutMe} />
            <Route path="products" component={ProfileProducts} />
            <Route path="services" component={ProfileServices} />
            <Route path="edit" component={() => <h1>Edit Profile</h1>} />
          </Route>

          <Route path="users/:userId" component={Profile}>
            <IndexRoute component={AboutMe} />
            <Route path="products" component={ProfileProducts} />
            <Route path="services" component={ProfileServices} />
          </Route>

          <Route path="products">
            <IndexRoute component={AllProducts} />
            <Route path="add" component={AddProduct} />
            <Route path=":productId" component={ProductDetails} />
            <Route path=":productId/edit" component={EditProduct} />
          </Route>

          <Route path="services">
            <IndexRoute component={AllServices} />
            <Route path="add" component={AddService} />
            <Route path=":serviceId" component={ServiceDetails} />
            <Route path=":serviceId/edit" component={EditService} />
          </Route>

          <Route path="exchanges" component={Exchanges}>
            <IndexRedirect to="incoming" />
            <Route path="incoming" component={ExchangesIncoming} />
            <Route path="outcoming" component={ExchangesOutcoming} />
            <Route path="pending" component={() => null} />
            <Route path="reported" component={() => null} />
            <Route path="archive" component={() => null} />
          </Route>
        </Route>
        <Redirect from="*" to="/" />
      </ReactRouter>
    );
  }
}

Router.propTypes = {
  store: PropTypes.any
};

export default Router;
