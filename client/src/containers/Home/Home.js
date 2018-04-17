import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import {selectUserData, selectUserStatus, selectAllProductsFor} from '../../selectors';
import {fetchProducts} from '../../actions/products';
import Home from '../../components/Home/Home';

const DEFAULT_LIMIT = 6;

const mapStateToProps = state => ({
  userData: selectUserData(state),
  userState: selectUserStatus(state),
  products: selectAllProductsFor(state, {skip: 0, limit: DEFAULT_LIMIT})
});

const mapDispatchToProps = dispatch => ({
  fetchProducts() {
    return dispatch(fetchProducts({scope: 'all', skip: 0, limit: DEFAULT_LIMIT}));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Home);