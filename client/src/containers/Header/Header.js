import {connect} from 'react-redux';

import {fetchUser} from '../../actions/user';
import {selectUserStatus, selectUserData} from '../../selectors';
import Header from '../../components/Header/Header';

const mapStateToProps = state => ({
  status: selectUserStatus(state),
  user: selectUserData(state)
});

const mapDispatchToProps = dispatch => ({
  fetchUser() {
    return dispatch(fetchUser());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
