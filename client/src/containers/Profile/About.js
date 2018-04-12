import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {updateProfile} from '../../actions/user';
import {fetchProducts} from '../../actions/products';
import {selectUserData, selectUserStatus, selectOwnProductsFor} from '../../selectors';
import AboutMe from '../../components/Profile/About';

const mapStateToProps = (state, ownProps) => {
  // if current user
  // check based on route or smth.
  if (!ownProps.userId) {
    return {
      isCurrentUser: true,
      user: selectUserData(state),
      status: selectUserStatus(state),
      products: selectOwnProductsFor(state, 0, 3)
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
  fetchProducts(scope, skip, limit) {
    return dispatch(fetchProducts(scope, skip, limit));
  },
  onAddProductClick() {
    ownProps.router.push('/products/add');
  },
  onAddServiceClick() {
    ownProps.router.push('/services/add');
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AboutMe);
