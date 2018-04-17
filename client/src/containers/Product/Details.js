import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'ramda';

import {selectOwnProductById} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import ProductDetails from '../../components/Product/Details';

class Details extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const {params, product} = this.props;
    if (!product && params.productId) {
      this.props.fetchProductById(params.productId);
    }
  }

  render() {
    const {product} = this.props;

    return product && product.data ? <ProductDetails product={product.data} /> : null;
  }
}

Details.propTypes = {
  product: PropTypes.any
};

const mapStateToProps = (state, ownProps) => ({
  product: selectOwnProductById(state, ownProps.params.productId)
});

const mapDispatchToProps = dispatch => ({
  fetchProductById(productId) {
    return dispatch(fetchProductById(productId));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Details);
