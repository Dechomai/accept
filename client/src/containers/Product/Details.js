import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, path} from 'ramda';

import {selectProductById, selectProfile} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import ProductDetails from '../../components/Product/Details';
import Loader from '../../components/common/Loader/Loader';

class Details extends React.Component {
  componentDidMount() {
    const {params, product} = this.props;
    if (!product && params.productId) {
      this.props.fetchProductById(params.productId);
    }
  }

  render() {
    const {product, user} = this.props;
    const userId = path(['data', 'id'], user);
    return product && product.data ? (
      <ProductDetails product={product.data} isOwner={product.data.createdBy.id === userId} />
    ) : (
      <Loader />
    );
  }
}

Details.propTypes = {
  product: PropTypes.any,
  user: PropTypes.any
};

const mapStateToProps = (state, ownProps) => ({
  user: selectProfile(state),
  product: selectProductById(state, ownProps.params.productId)
});

const mapDispatchToProps = dispatch => ({
  fetchProductById(productId) {
    return dispatch(fetchProductById(productId));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Details);
