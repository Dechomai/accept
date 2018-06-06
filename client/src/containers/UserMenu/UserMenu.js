import {connect} from 'react-redux';
import {compose} from 'recompact';
import {withRouter} from 'react-router';

import {fetchProfile} from '../../actions/user';
import {selectProfile} from '../../selectors';
import UserMenu from '../../components/UserMenu/UserMenu';

const mapStateToProps = state => ({
  user: selectProfile(state)
});

const mapDispatchToProps = dispatch => ({
  fetchProfile() {
    return dispatch(fetchProfile());
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(UserMenu);
