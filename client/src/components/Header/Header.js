import './Header.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import Icon from '../common/Icon/Icon';
import UserAvatar from '../UserAvatar/UserAvatar';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  componentDidMount() {
    const {user} = this.props;
    if (!user || (!user.data && !user.loading && !user.error)) {
      this.props.fetchProfile();
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
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
    const {user} = this.props;
    const {loading, error} = user;
    if (loading) return null; // show spinner or smth
    if (error) return this.getSignInButton();
    if (user && user.data)
      return (
        <Dropdown
          className="header__user-info__avatar"
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}>
          <DropdownToggle caret className="header__user-info__toggle">
            <UserAvatar user={user.data} />
          </DropdownToggle>
          <DropdownMenu right className="header__user-info__dropdown">
            <Link to="/profile" className="header__user-info__dropdown__link">
              <DropdownItem>
                <Icon name="account" size="20" />
                <small className="text-muted">Profile</small>
              </DropdownItem>
            </Link>
            <DropdownItem divider />
            <DropdownItem href="/logout" className="header__user-info__dropdown__link">
              <Icon name="logout" size="20" />
              <small className="text-muted">Logout</small>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    return null;
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
            {user &&
              user.data && (
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
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  fetchProfile: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default Header;
