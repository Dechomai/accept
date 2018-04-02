import './UserPanel.scss';

import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../common/Icon/Icon';

class UserPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isOwn} = this.props;

    return (
      <div className="user-panel">
        <div className="user-panel__details">
          <img
            className="user-panel__photo"
            src="https://ui-avatars.com/api/?name=George+Smith&background=e0610e&color=fff&size=132"
          />
          <span className="user-panel__name">@example</span>
          <div className="user-panel__location">
            <Icon name="map-marker" size="20" />
            <span>Lviv, UA</span>
          </div>
        </div>
        <div className="user-panel__actions">
          {isOwn ? (
            <button className="user-panel__edit">
              <Icon name="pencil" size="20" />
              <span>Edit personal info</span>
            </button>
          ) : (
            <button className="user-panel__contact">Contact</button>
          )}
        </div>
      </div>
    );
  }
}

UserPanel.propTypes = {
  isOwn: PropTypes.bool.isRequired
};

export default UserPanel;
