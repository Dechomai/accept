import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, path} from 'ramda';
import autobind from 'autobindr';

import {selectProductById, selectProfile} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import {startNewExchange} from '../../actions/exchange';
import ProductDetails from '../../components/Product/Details';
import Loader from '../../components/common/Loader/Loader';
import Exchange from '../Exchange/Exchange';

class Details extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showExchange: false
    };
  }

  componentDidMount() {
    const {params, product, router} = this.props;
    if (!product && params.productId) {
      this.props.fetchProductById(params.productId);
    }

    if (router.location.query.step) {
      this.setState({
        showExchange: true
      });
    }
  }

  handleExchangeClick() {
    this.props.startNewExchange();
    this.setState({
      showExchange: true
    });
  }

  handleExchangeCancel() {
    const {router} = this.props;

    this.setState({
      showExchange: false
    });

    router.push({
      pathname: router.location.pathname,
      query: {}
    });
  }

  render() {
    const {product, user} = this.props;
    const userId = path(['data', 'id'], user);
    if (path(['data'], product)) {
      return (
        <React.Fragment>
          {this.state.showExchange && (
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
  user: PropTypes.any
};

const mapStateToProps = (state, ownProps) => ({
  user: selectProfile(state),
  product: selectProductById(state, ownProps.params.productId)
});

const mapDispatchToProps = dispatch => ({
  fetchProductById(productId) {
    return dispatch(fetchProductById(productId));
  },
  startNewExchange() {
    return dispatch(startNewExchange());
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Details);
