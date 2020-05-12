import {connect} from 'react-redux';

import {selectProfile, selectUser} from '../../selectors';
import UserPanel from '../../components/UserPanel/UserPanel';

const mapStateToProps = (state, ownProps) => {
  const {userId} = ownProps;
  if (!userId) {
    return {
      isCurrentUser: true,
      user: selectProfile(state)
    };
  }

  return {
    isCurrentUser: false,
    user: selectUser(state, userId)
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel);
