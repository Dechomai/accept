import './App.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../containers/Header/Header';
import Footer from '../components/Footer/Footer';

const App = ({children, routes}) => {
  const showFooter = !routes.some(route => route.showFooter === false);
  return (
    <div className="app-container">
      <Header />
      <div className="app-container__content">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
};

App.propTypes = {
  routes: PropTypes.array.isRequired
};

export default App;
