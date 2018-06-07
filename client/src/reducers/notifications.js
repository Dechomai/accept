import createReducer from '../utils/createReducer';
import {uniqBy, prop, compose, concat, sort} from 'ramda';

import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATIONS_AS_SEEN,
  MARK_NOTIFICATION_AS_READ_SUCCESS
} from '../actions/notifications';

const getInitialState = () => ({
  loading: false,
  error: null,
  data: [],
  new: false,
  updatedAt: null
});

const uniqById = uniqBy(prop('id'));
const sortByDate = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt);
const concatNotifications = (prev, curr) => compose(sort(sortByDate), uniqById, concat(prev))(curr);

const notifications = createReducer(getInitialState(), {
  [FETCH_NOTIFICATIONS_REQUEST](state) {
    return {
      ...state,
      loading: true
    };
  },
  [FETCH_NOTIFICATIONS_SUCCESS](state, payload) {
    const {notifications} = payload; // new
    const {data} = state; // old
    // concat new and old notifications
    // filter out duplicates(just in case shit happens)
    // sort by updatedAt, to remain sorted order
    const newData = notifications.length ? concatNotifications(data, notifications) : data;

    return {
      ...state,
      loading: false,
      data: newData,
      error: null,
      // set "new" flag if number of notifications changes and some has status:"new"
      new:
        notifications.length !== state.data.length && notifications.find(n => n.status === 'new'),
      updatedAt: new Date().toISOString()
    };
  },
  [FETCH_NOTIFICATIONS_FAILURE](state, payload) {
    return {
      ...state,
      loading: false,
      error: payload.error
    };
  },
  [MARK_NOTIFICATIONS_AS_SEEN](state) {
    return {
      ...state,
      new: false
    };
  },
  [MARK_NOTIFICATION_AS_READ_SUCCESS](state, payload) {
    const {notification} = payload;
    return {
      ...state,
      data: state.data.map(n => (n.id === notification.id ? {...n, status: 'read'} : n))
    };
  }
});

export default notifications;
