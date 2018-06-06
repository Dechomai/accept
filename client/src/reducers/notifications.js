import createReducer from '../utils/createReducer';

import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATION_AS_SEEN
} from '../actions/notifications';

const getInitialState = () => ({
  loading: false,
  error: null,
  data: [],
  new: false
});

const notifications = createReducer(getInitialState(), {
  [FETCH_NOTIFICATIONS_REQUEST](state) {
    return {
      ...state,
      loading: true
    };
  },
  [FETCH_NOTIFICATIONS_SUCCESS](state, payload) {
    const {notifications} = payload;
    return {
      ...state,
      loading: false,
      data: notifications,
      error: null,
      new: notifications.length !== state.data.length && notifications.find(n => n.status === 'new')
    };
  },
  [FETCH_NOTIFICATIONS_FAILURE](state, payload) {
    return {
      ...state,
      loading: false,
      error: payload.error
    };
  },
  [MARK_NOTIFICATION_AS_SEEN](state) {
    return {
      ...state,
      new: false
    };
  }
});

export default notifications;
