import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
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
const mapDispatchToProps = (dispatch, ownProps) => ({
  updateProfile(profile) {
    return dispatch(updateProfile(profile));
  },
  onAddProductClick() {
    ownProps.router.push('/products/add');
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AboutMe);
