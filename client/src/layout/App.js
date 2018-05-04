import './App.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../containers/Header/Header';
import Footer from '../components/Footer/Footer';

class App extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {children, routes} = this.props;
    const showFooter = !routes.some(route => route.showFooter === false);
    return (
      <div className="app-container">
        <Header />
        <div className="app-container__content">{children}</div>
        {showFooter && <Footer />}
      </div>
    );
  }
}

App.propTypes = {
  routes: PropTypes.array.isRequired,
  location: PropTypes.any.isRequired
};

export default App;
