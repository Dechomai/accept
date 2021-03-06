import './main.scss';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import createStore from './store';
import Router from './router';
import exchangeCache from './services/exchangeCache';

import {fetchProfile} from './actions/user';

const start = performance.now();

// disable React Dev Tools in production
if (
  ENV === 'production' &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
  Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length
) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers = {};
}

if (ENV === 'production') {
  console.log('%cBUILD INFO', 'font-size: large; color: blue;');
  console.group();
  console.log(
    '%cTAG: %c%s',
    'font-size: large; color: violet;',
    'font-size: large; color: green;',
    BUILD_INFO.BUILD_ID
  );
}

// fetch initial data dependencies and render
Promise.all([
  // load external data
  // or initial state
])
  .then(() => {
    const initialState = {};
    const exchange = exchangeCache.get();
    if (exchange) initialState.exchange = exchange;

    return createStore(initialState);
  })
  .then(store =>
    Promise.all([
      store,
      // fetch user data before rendering app
      // catch error if user is unauthorized(we don't care here)
      store.dispatch(fetchProfile()).catch(() => {})
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
