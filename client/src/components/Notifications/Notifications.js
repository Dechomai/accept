import './Notifications.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Dropdown, DropdownToggle, DropdownMenu} from 'reactstrap';

import {shouldRefetchItem} from '../../utils/refetch';
import Icon from '../common/Icon/Icon';
import Notification from './Notification';

const UPDATE_INTERVAL = 60 * 1000; // 60 seconds

class Notifications extends React.Component {
  componentDidMount() {
    if (shouldRefetchItem(this.props.notifications)) {
      this.props.fetchNotifications();
    }

    this.updateInterval = setInterval(() => {
      const sinceDate = this.props.notifications.updatedAt;
      this.props.fetchNotifications(sinceDate);
    }, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  handleNotificationClick(notification) {
    const {subject} = notification;
    this.props.onToggle();
    switch (subject) {
      case 'Exchange.new': {
        this.props.markNotificationAsRead(notification.id);
        this.props.router.push('/exchanges/incoming');
        break;
      }
      case 'Exchange.accepted': {
        this.props.markNotificationAsRead(notification.id);
        this.props.router.push('/exchanges/pending');
        break;
      }
      case 'Exchange.rejected': {
        this.props.markNotificationAsRead(notification.id);
        this.props.router.push('/exchanges/archive');
        break;
      }
      case 'Exchange.validated': {
        this.props.markNotificationAsRead(notification.id);
        if (notification.exchange.status === 'completed') {
          this.props.router.push('/exchanges/archive');
        } else {
          this.props.router.push('/exchanges/pending');
        }
        break;
      }
      case 'Exchange.reported': {
        this.props.markNotificationAsRead(notification.id);
        this.props.router.push('/exchanges/reported');
        break;
      }
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen && nextProps.notifications.new) {
      this.props.markNotificationsAsSeen();
    }
  }

  render() {
    const {notifications, user, isOpen, onToggle} = this.props;

    return (
      <Dropdown className="notifications" isOpen={isOpen} toggle={onToggle}>
        <DropdownToggle
          className={classNames('notifications__toggle', {
            'notifications__toggle--new': notifications.new
          })}>
          <Icon name="message-alert" size="24" />
        </DropdownToggle>
        <DropdownMenu right className="notifications__dropdown">
          <div className="notifications__dropdown__content">
            {notifications.data.length ? (
              <React.Fragment>
                <div className="notifications__dropdown__title">
                  Notifications ({notifications.data.length}){' '}
                </div>
                {notifications.data.map(notification => (
                  <Notification
                    key={notification.id}
                    user={user.data}
                    notification={notification}
                    onClick={() => this.handleNotificationClick(notification)}
                  />
                ))}
              </React.Fragment>
            ) : (
              <div className="notifications__dropdown__title notifications__dropdown__title--empty">
                You have no new notifications
              </div>
            )}
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

Notifications.propTypes = {
  notifications: PropTypes.object.isRequired,
  fetchNotifications: PropTypes.func.isRequired,
  markNotificationAsRead: PropTypes.func.isRequired,
  markNotificationsAsSeen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  router: PropTypes.any
};

export default Notifications;
