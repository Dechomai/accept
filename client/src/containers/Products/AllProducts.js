import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import AllProducts from '../../components/Products/AllProducts';
import {selectAllProductsFor} from '../../selectors';
import {fetchProducts} from '../../actions/products';

const DEFAULT_LIMIT = 20;

const mapStateToProps = state => ({
  products: selectAllProductsFor(state, 0, DEFAULT_LIMIT)
});

const mapDispatchToProps = dispatch => ({
  fetchProducts() {
    return dispatch(fetchProducts('all', 0, DEFAULT_LIMIT));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AllProducts);
