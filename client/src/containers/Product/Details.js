import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, path} from 'ramda';

import {selectProductById, selectProfile} from '../../selectors';
import {fetchProductById} from '../../actions/products';
import ProductDetails from '../../components/Product/Details';
import Loader from '../../components/common/Loader/Loader';
import Exchange from '../Exchange/Exchange';
import autobind from 'autobindr';

class Details extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showExchange: false
    };
  }

  toggleExchange() {
    this.setState({
      showExchange: !this.state.showExchange
    });
  }

  componentDidMount() {
    const {params, product} = this.props;
    if (!product && params.productId) {
      this.props.fetchProductById(params.productId);
    }
  }

  render() {
    const {product, user} = this.props;
    const userId = path(['data', 'id'], user);
    if (path(['data'], product)) {
      return (
        <div>
          {this.state.showExchange && <Exchange toggleExchangeContainer={this.toggleExchange} />}
          <ProductDetails
            product={product.data}
            isOwner={product.data.createdBy.id === userId}
            toggleExchange={this.toggleExchange}
          />
        </div>
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
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Details);
