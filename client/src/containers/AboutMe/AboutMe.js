import {connect} from 'react-redux';
import {updateProfile} from '../../actions/user';
import {selectUserData, selectUserStatus} from '../../selectors';
import AboutMe from '../../components/Profile/AboutMe/AboutMe';

const mapStateToProps = (state, ownProps) => {
  // if current user
  // check based on route or smth.
  if (!ownProps.userId) {
    return {
      isCurrentUser: true,
      user: selectUserData(state),
      status: selectUserStatus(state)
    };
  }

  return {
    isCurrentUser: false,
    user: null,
    status: {
      loading: false,
      error: null
    }
  };
};
const mapDispatchToProps = dispatch => ({
  updateProfile(profile) {
    return dispatch(updateProfile(profile));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutMe);
