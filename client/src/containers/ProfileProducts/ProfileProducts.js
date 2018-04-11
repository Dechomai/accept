import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ProfileProducts from '../../components/Profile/ProfileProducts/ProfileProducts';
import {fetchProducts} from '../../actions/products';

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchProducts(scope, skip, limit) {
    return dispatch(fetchProducts(scope, skip, limit));
  },
  onAddProductClick() {
    ownProps.router.push('/products/add');
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ProfileProducts);
