import './Header.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import autobind from 'autobindr';

import Notifications from '../../containers/Notifications/Notifications';
import UserMenu from '../../containers/UserMenu/UserMenu';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userMenuOpen: false,
      notificationsOpen: false
    };
    autobind(this);
  }

  handleUserMenuToggle() {
    this.setState({
      userMenuOpen: !this.state.userMenuOpen,
      notificationsOpen: false
    });
  }

  handleNotificationsToggle() {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
      userMenuOpen: false
    });
  }

  render() {
    const {user} = this.props;
    return (
      <header className="header">
        <div className="container header__container">
          <div className="header__logo">
            <Link to="/" className="header__logo__link">
              <img className="header__logo__img" src="/assets/logo.svg" alt="Accept" />
            </Link>
          </div>
          <div className="header__content">
            {user && user.data && (
              <React.Fragment>
                <nav className="header__nav">
                  <Link
                    to="/products/add"
                    className="header__nav__item"
                    activeClassName="header__nav__item--active"
                    onlyActiveOnIndex>
                    Sell
                  </Link>
                  <span className="header__nav__separator">or</span>
                  <Link
                    to="/services/add"
                    className="header__nav__item"
                    activeClassName="header__nav__item--active"
                    onlyActiveOnIndex>
                    Offer
                  </Link>
                </nav>
                <div className="header__notifications">
                  <Notifications
                    isOpen={this.state.notificationsOpen}
                    onToggle={this.handleNotificationsToggle}
                  />
                </div>
                <div className="header__user-info">
                  <UserMenu isOpen={this.state.userMenuOpen} onToggle={this.handleUserMenuToggle} />
                </div>
              </React.Fragment>
            )}
            {user && user.error && (
              <div className="header__signin">
                <a className="btn btn-sm btn-round" href="/login">
                  Sign in
                </a>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired
};

export default Header;
