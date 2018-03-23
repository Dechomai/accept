import './UserInfo.scss';

import React from 'react';
import PropTypes from 'prop-types';

class UserInfo extends React.Component {
  render() {
    return (
      <div className="user-info">
        <div className="user-info__avatar">
          <span className="user-info__avatar__label">AB</span>
        </div>
        {/* <div className="user-info__dropdown-arrow">v</div> */}
      </div>
    );
  }
}

UserInfo.propTypes = {
  user: PropTypes.shape({}).isRequired
};

export default UserInfo;
