import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose, path} from 'ramda';
import autobind from 'autobindr';

import {selectProductById, selectProfile, selectExchangeStep} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import {startNewExchange, cancelExchange} from '../../actions/exchange';
import ProductDetails from '../../components/Product/Details';
import Loader from '../../components/common/Loader/Loader';
import Exchange from '../Exchange/Exchange';

class Details extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const {params, product} = this.props;
    if (!product && params.productId) {
      this.props.fetchProductById(params.productId);
    }
  }

  handleExchangeClick() {
    this.props.startNewExchange();
  }

  handleExchangeCancel() {
    this.props.cancelExchange();
  }

  render() {
    const {product, user} = this.props;
    const userId = path(['data', 'id'], user);
    if (path(['data'], product)) {
      return (
        <React.Fragment>
          {this.props.exchangeStep >= 0 && (
            <Exchange
              type="product"
              itemId={product.data.id}
              onCancel={this.handleExchangeCancel}
            />
          )}
          <ProductDetails
            product={product.data}
            isOwner={product.data.createdBy.id === userId}
            onExchangeClick={this.handleExchangeClick}
          />
        </React.Fragment>
      );
    } else if (path(['loading'], product)) {
      return <Loader />;
    } else {
      return <div className="alert alert-danger">There is no product with specified ID</div>;
    }
  }
}

Details.propTypes = {
  product: PropTypes.any,
  user: PropTypes.any,
  exchangeStep: PropTypes.number
};

const mapStateToProps = (state, ownProps) => ({
  user: selectProfile(state),
  product: selectProductById(state, ownProps.params.productId),
  exchangeStep: selectExchangeStep(state)
});

const mapDispatchToProps = dispatch => ({
  fetchProductById(productId) {
    return dispatch(fetchProductById(productId));
  },
  startNewExchange() {
    return dispatch(startNewExchange());
  },
  cancelExchange() {
    return dispatch(cancelExchange());
  }
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Details);
