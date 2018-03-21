import './App.scss';
import React from 'react';

import Header from '../containers/Header/Header';

const App = ({children}) => (
  <div className="app-container">
    <Header />
    <div className="app-container__content">{children}</div>
  </div>
);

export default App;
