import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {updateProfile} from '../../actions/user';
import {fetchUser} from '../../actions/users';
import {fetchProducts, deleteProduct} from '../../actions/products';
import {fetchServices, deleteService} from '../../actions/services';
import {
  selectProfile,
  selectOwnProductsFor,
  selectUserProductsFor,
  selectOwnServicesFor,
  selectUserServicesFor,
  selectUser
} from '../../selectors';
import AboutMe from '../../components/Profile/About';

const mapStateToProps = (state, ownProps) => {
  const {userId} = ownProps.params;

  if (!userId) {
    return {
      isCurrentUser: true,
      user: selectProfile(state),
      products: selectOwnProductsFor(state, {skip: 0, limit: 3}),
      services: selectOwnServicesFor(state, {skip: 0, limit: 3})
    };
  }

  return {
    isCurrentUser: false,
    userId,
    user: selectUser(state, userId),
    products: selectUserProductsFor(state, {userId, skip: 0, limit: 4}),
    services: selectUserServicesFor(state, {userId, skip: 0, limit: 4})
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateProfile(profile) {
    return dispatch(updateProfile(profile));
  },
  fetchUser(userId) {
    return dispatch(fetchUser(userId));
  },
  fetchProducts({scope, skip, limit}) {
    return dispatch(fetchProducts({scope, skip, limit}));
  },
  fetchServices({scope, skip, limit}) {
    return dispatch(fetchServices({scope, skip, limit}));
  },
  deleteProduct(productId) {
    return dispatch(deleteProduct(productId));
  },
  deleteService(serviceId) {
    return dispatch(deleteService(serviceId));
  },
  onAddProductClick() {
    ownProps.router.push('/products/add');
  },
  onAddServiceClick() {
    ownProps.router.push('/services/add');
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AboutMe);
