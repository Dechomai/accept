import './UserInfo.scss';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import React from 'react';
import PropTypes from 'prop-types';

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
            <span className="user-info__label">JC</span>
          </DropdownToggle>
          <DropdownMenu right={true} className="user-info__dropdown">
            <DropdownItem header>Header</DropdownItem>
            <DropdownItem disabled>Action</DropdownItem>
            <DropdownItem>Another Action</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Another Action</DropdownItem>
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
