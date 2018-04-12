import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ProfileProducts from '../../components/Profile/Products';
import {fetchProducts} from '../../actions/products';
import {selectSomeOwnProducts} from '../../selectors';

const DEFAULT_LIMIT = 19;

const mapStateToProps = state => ({
  products: selectSomeOwnProducts(state, 0, DEFAULT_LIMIT)
});

const mapDispatchToProps = dispatch => ({
  fetchProducts() {
    return dispatch(fetchProducts('user', 0, DEFAULT_LIMIT));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ProfileProducts);
