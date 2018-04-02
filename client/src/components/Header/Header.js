import './Header.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

import UserInfo from '../UserInfo/UserInfo';

class Header extends React.Component {
  componentDidMount() {
    if (!this.props.user && !this.props.status.loading && !this.props.status.error) {
      this.props.fetchUser();
    }
  }

  getSignInButton() {
    return (
      <div className="header__signin">
        <a className="btn btn-sm btn-round" href="/login">
          Sign in
        </a>
      </div>
    );
  }

  getUserInfo() {
    const {user, status} = this.props;
    const {loading, error} = status;
    if (loading) return null; // show spinner or smth
    if (error) return this.getSignInButton();
    if (user) return <UserInfo user={user} />;
    return null;
  }

  render() {
    return (
      <header className="header">
        <div className="header__logo">
          <Link to="/" className="header__logo__link">
            <img className="header__logo__img" src="/assets/logo.svg" alt="Accept" />
          </Link>
        </div>
        <div className="header__content">
          {this.props.user && (
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
          )}
          <div className="header__user-info">{this.getUserInfo()}</div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  user: PropTypes.object,
  status: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any
  })
};

export default Header;
