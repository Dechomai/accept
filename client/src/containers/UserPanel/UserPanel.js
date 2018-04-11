import {connect} from 'react-redux';

import {selectUserData, selectUserStatus} from '../../selectors';
import UserPanel from '../../components/UserPanel/UserPanel';

const mapStateToProps = (state, ownProps) => {
  // if current user
  // check based on route or smth.
  if (ownProps.userId) {
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

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel);
