import {connect} from 'react-redux';
import {pick} from 'ramda';

import {updateProfile} from '../../actions/user';
import {selectProfile} from '../../selectors';
import EditProfile from '../../components/Profile/Edit/Edit';

const mapStateToProps = state => {
  const profile = selectProfile(state);
  return {
    profile: profile && profile.data,
    status: profile && pick(['loading', 'error'], profile)
  };
};

const mapDispatchToProps = dispatch => ({
  updateProfile(info) {
    return dispatch(updateProfile(info));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
