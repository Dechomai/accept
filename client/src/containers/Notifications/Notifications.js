import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose} from 'recompact';

import {selectProfile, selectNotifications} from '../../selectors';
import {
  fetchNotifications,
  markNotificationAsRead,
  markNotificationsAsSeen
} from '../../actions/notifications';
import Notifications from '../../components/Notifications/Notifications';

const mapStateToProps = state => ({
  user: selectProfile(state),
  notifications: selectNotifications(state)
});

const mapDispatchToProps = dispatch => ({
  fetchNotifications(sinceDate) {
    return dispatch(fetchNotifications(sinceDate));
  },
  markNotificationAsRead(id) {
    return dispatch(markNotificationAsRead(id));
  },
  markNotificationsAsSeen() {
    return dispatch(markNotificationsAsSeen());
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Notifications);
