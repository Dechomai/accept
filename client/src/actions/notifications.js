import notificationsService from '../services/notifications';

export const FETCH_NOTIFICATIONS_REQUEST = 'FETCH_NOTIFICATIONS_REQUEST';
export const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
export const FETCH_NOTIFICATIONS_FAILURE = 'FETCH_NOTIFICATIONS_FAILURE';

export const MARK_NOTIFICATIONS_AS_SEEN = 'MARK_NOTIFICATIONS_AS_SEEN';

export const MARK_NOTIFICATION_AS_READ_REQUEST = 'MARK_NOTIFICATION_AS_READ_REQUEST';
export const MARK_NOTIFICATION_AS_READ_SUCCESS = 'MARK_NOTIFICATION_AS_READ_SUCCESS';
export const MARK_NOTIFICATION_AS_READ_FAILURE = 'MARK_NOTIFICATION_AS_READ_FAILURE';

export const fetchNotificationsRequest = () => ({
  type: FETCH_NOTIFICATIONS_REQUEST,
  payload: {}
});

export const fetchNotificationsSuccess = notifications => ({
  type: FETCH_NOTIFICATIONS_SUCCESS,
  payload: {
    notifications
  }
});

export const fetchNotificationsFailure = error => ({
  type: FETCH_NOTIFICATIONS_FAILURE,
  payload: {
    error
  }
});

export const fetchNotifications = sinceDate => dispatch => {
  dispatch(fetchNotificationsRequest());

  return notificationsService
    .getNotifications(sinceDate)
    .then(
      data => dispatch(fetchNotificationsSuccess(data.notifications)),
      err => Promise.reject(dispatch(fetchNotificationsFailure(err)))
    );
};

export const markNotificationAsReadRequest = () => ({
  type: MARK_NOTIFICATION_AS_READ_REQUEST,
  payload: {}
});

export const markNotificationAsReadSuccess = notification => ({
  type: MARK_NOTIFICATION_AS_READ_SUCCESS,
  payload: {
    notification
  }
});

export const markNotificationAsReadFailure = error => ({
  type: MARK_NOTIFICATION_AS_READ_FAILURE,
  payload: {
    error
  }
});

export const markNotificationAsRead = id => dispatch => {
  dispatch(markNotificationAsReadRequest());

  return notificationsService
    .markAsRead(id)
    .then(
      data => dispatch(markNotificationAsReadSuccess(data.notification)),
      err => Promise.reject(dispatch(markNotificationAsReadFailure(err)))
    );
};

export const markNotificationsAsSeen = () => ({
  type: MARK_NOTIFICATIONS_AS_SEEN
});
