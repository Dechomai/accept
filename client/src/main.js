import 'bootstrap/dist/css/bootstrap.min.css';
import './main.scss';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import createStore from './store';
import Router from './router';

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
      store
      // dispatch initial actions on store
      // store.dispatch( some action )
    ])
  )
  .then(([store]) => {
    const rootEl = document.querySelector('#root');

    return render(
      <Provider store={store}>
        <Router />
      </Provider>,
      rootEl
    );
  })
  .then(() => {
    if (ENV === 'development') {
      console.log(`initial render after ${(performance.now() - start).toFixed(2)}ms`);
    }
  });
