import {createSelector} from 'reselect';

const selectUser = state => state.user;

export const selectUserStatus = createSelector(selectUser, ({loading, error}) => ({
  loading,
  error
}));
export const selectUserData = createSelector(selectUser, ({data}) => data);
