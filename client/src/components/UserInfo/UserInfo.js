import './UserInfo.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {Link} from 'react-router';

import Icon from '../common/Icon/Icon';

const getInitials = user => `${user.firstName[0]}${user.lastName[0]}`;

class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div className="user-info">
        <Dropdown
          className="user-info__avatar"
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}>
          <DropdownToggle caret className="user-info__toggle">
            <span className="user-info__label">{getInitials(this.props.user)}</span>
          </DropdownToggle>
          <DropdownMenu right={true} className="user-info__dropdown">
            <DropdownItem>
              <Link to="/profile" className="user-info__dropdown__link">
                <Icon name="account" size="20" />
                <small className="text-muted">Profile</small>
              </Link>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem href="/signout" className="user-info__dropdown__link">
              <Icon name="logout" size="20" />
              <small className="text-muted">Logout</small>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

UserInfo.propTypes = {
  user: PropTypes.shape({}).isRequired
};

export default UserInfo;
