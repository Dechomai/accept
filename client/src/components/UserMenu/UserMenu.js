import './UserMenu.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import Icon from '../common/Icon/Icon';
import UserAvatar from '../UserAvatar/UserAvatar';

class UserMenu extends React.Component {
  componentDidMount() {
    const {user} = this.props;
    if (!user || (!user.data && !user.loading && !user.error)) {
      this.props.fetchProfile();
    }
  }

  render() {
    const {user, isOpen, onToggle} = this.props;

    if (user && user.data)
      return (
        <Dropdown className="user-menu" isOpen={isOpen} toggle={onToggle}>
          <DropdownToggle caret className="user-menu__toggle">
            <UserAvatar user={user.data} />
          </DropdownToggle>
          <DropdownMenu right className="user-menu__dropdown">
            <Link to="/profile" className="user-menu__dropdown__link">
              <DropdownItem>
                <Icon name="account" size="20" />
                <small className="text-muted">Profile</small>
              </DropdownItem>
            </Link>
            <Link to="/exchanges" className="user-menu__dropdown__link">
              <DropdownItem>
                <Icon name="chart-line-variant" size="20" />
                <small className="text-muted">Account Activities</small>
              </DropdownItem>
            </Link>
            <DropdownItem divider />
            <DropdownItem href="/logout" className="user-menu__dropdown__link">
              <Icon name="logout" size="20" />
              <small className="text-muted">Logout</small>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    return null;
  }
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default UserMenu;
