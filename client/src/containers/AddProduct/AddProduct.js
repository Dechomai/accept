import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, assoc} from 'ramda';
import autobind from 'autobindr';

import AddProductForm from '../../components/AddProductForm/AddProductForm';
import {selectUserStatus} from '../../selectors';
import PropTypes from 'prop-types';
import {createProduct} from '../../actions/product';

class AddProduct extends React.Component {
  constructor() {
    super();
    autobind(this);
    this.photos = [];
  }

  handleFormSubmit(product) {
    let data = product;
    if (this.photos.length) {
      data = assoc('photos', this.photos, product);
    }

    console.log('data', data);
    return this.props.createProduct(data).then(() => {
      this.props.router.push('/');
    });
  }

  handlePhotosAdding(photos) {
    this.photos = photos;
  }

  render() {
    return (
      <AddProductForm
        loading={this.props.status.loading}
        error={this.props.status.error}
        onSubmit={this.handleFormSubmit}
        onPhotoAdded={this.handlePhotosAdding}
      />
    );
  }
}

AddProduct.propTypes = {
  router: PropTypes.any,
  status: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any
  }),
  createProduct: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  status: selectUserStatus(state)
});

const mapDispatchToProps = dispatch => ({
  createProduct(product) {
    return dispatch(createProduct(product));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AddProduct);
