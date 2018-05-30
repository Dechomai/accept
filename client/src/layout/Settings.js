import './Settings.scss';

import React from 'react';
import {Link} from 'react-router';

const AccountSettings = ({children}) => {
  return (
    <div className="account-settings__page">
      <div className="account-settings__header">
        <div className="container d-flex justify-content-between">
          <h4>Account Settings</h4>
          <nav className="account-settings__nav">
            <Link
              to="/profile/edit"
              className="account-settings__nav-item"
              activeClassName="account-settings__nav-item--active"
              onlyActiveOnIndex>
              Personal info
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AccountSettings;
