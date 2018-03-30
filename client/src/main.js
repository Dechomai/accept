import './main.scss';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import createStore from './store';
import Router from './router';

import {fetchUser} from './actions/user';

const start = performance.now();

// fetch initial data dependencies and render
Promise.all([
  // load external data
  // or initial state
])
  .then(() => {
    const initialState = {}; // or populate from loaded data

    return createStore(initialState);
  })
  .then(store =>
    Promise.all([
      store,
      // fetch user data before rendering app
      // catch error if user is unauthorized(we don't care here)
      store.dispatch(fetchUser()).catch(() => {})
    ])
  )
  .then(([store]) => {
    const rootEl = document.querySelector('#root');
    return render(
      <Provider store={store}>
        <Router store={store} />
      </Provider>,
      rootEl
    );
  })
  .then(() => {
    if (ENV === 'development') {
      console.log(`initial render after ${(performance.now() - start).toFixed(2)}ms`);
    }
  });
