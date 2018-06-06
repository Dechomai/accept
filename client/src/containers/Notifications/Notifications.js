import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose} from 'recompact';

import {selectProfile, selectNotifications} from '../../selectors';
import {
  fetchNotifications,
  markNotificationAsRead,
  markNotificationAsSeen
} from '../../actions/notifications';
import Notifications from '../../components/Notifications/Notifications';

const mapStateToProps = state => ({
  user: selectProfile(state),
  notifications: selectNotifications(state)
});

const mapDispatchToProps = dispatch => ({
  fetchNotifications() {
    return dispatch(fetchNotifications());
  },
  markNotificationAsRead(id) {
    return dispatch(markNotificationAsRead(id));
  },
  markNotificationAsSeen() {
    return dispatch(markNotificationAsSeen());
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Notifications);
