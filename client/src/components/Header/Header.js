import './Header.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

class Header extends React.Component {
  componentDidMount() {
    if (!this.props.user && !this.props.status.loading && !this.props.status.error) {
      this.props.fetchUser();
    }
  }

  getUserInfo() {
    const {user, status} = this.props;
    const {loading, error} = status;
    if (loading) return 'spinner';
    if (error) return <a href="/login">Login</a>;
    if (user) return user.email;
    return null;
  }

  render() {
    return (
      <header className="header">
        <nav className="header__nav">
          <Link
            to="/"
            className="header__nav-item"
            activeClassName="header__nav-item--active"
            onlyActiveOnIndex>
            Home
          </Link>
          <Link
            to="/profile"
            className="header__nav-item"
            activeClassName="header__nav-item--active"
            onlyActiveOnIndex>
            Profile
          </Link>
        </nav>
        <div className="header__user-info">{this.getUserInfo()}</div>
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
