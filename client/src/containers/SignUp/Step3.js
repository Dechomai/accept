import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {compose, withHandlers} from 'recompact';
import {pick} from 'ramda';

import {confirmProfile} from '../../actions/user';
import {selectProfile} from '../../selectors';
import SignUpStep3 from '../../components/SignUp/Step3';
import userService from '../../services/user';

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const {loading, error} = pick(['loading', 'error'], profile);

  return {
    loading,
    error
  };
};

const mapDispatchToProps = dispatch => ({
  confirmProfile(data) {
    return dispatch(confirmProfile(data));
  }
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    onSubmit: ({confirmProfile}) => data => {
      return confirmProfile(data).then(() => {}, () => toast.error('Sorry, something went wrong'));
    },
    onClickOk: ({router}) => account => {
      userService.getTestEther(account);
      router.push('/');
    }
  })
)(SignUpStep3);
