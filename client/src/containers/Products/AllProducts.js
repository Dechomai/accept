import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import AllProducts from '../../components/Products/AllProducts';
import {selectAllProductsFor, selectAllProductsCount} from '../../selectors';
import {fetchProducts} from '../../actions/products';

const DEFAULT_LIMIT = 20;

const mapStateToProps = state => ({
  products: selectAllProductsFor(state, {skip: 0, limit: DEFAULT_LIMIT}),
  count: selectAllProductsCount(state)
});

const mapDispatchToProps = dispatch => ({
  fetchProducts() {
    return dispatch(fetchProducts({scope: 'all', skip: 0, limit: DEFAULT_LIMIT}));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AllProducts);
