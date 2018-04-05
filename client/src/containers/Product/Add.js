import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, without} from 'ramda';
import autobind from 'autobindr';

import AddProductForm from '../../components/Product/AddForm';
import {selectUserStatus} from '../../selectors';
import PropTypes from 'prop-types';
import {createProduct} from '../../actions/product';

class Add extends React.Component {
  constructor() {
    super();
    autobind(this);
    this.state = {photos: []};
  }

  handleFormSubmit(product) {
    let data = product;

    return this.props.createProduct(data).then(() => {
      this.props.router.push('/');
    });
  }

  handlePhotosAdded(photos) {
    this.setState({photos});
  }

  handlePhotoDelete(photo) {
    this.setState({
      photos: without([photo], this.state.photos)
    });
  }

  handleCancelClick() {
    this.props.router.goBack();
  }
  render() {
    return (
      <AddProductForm
        loading={this.props.status.loading}
        error={this.props.status.error}
        onSubmit={this.handleFormSubmit}
        photos={this.state.photos}
        onPhotosAdded={this.handlePhotosAdded}
        onPhotoDelete={this.handlePhotoDelete}
        onCancelClick={this.handleCancelClick}
      />
    );
  }
}

Add.propTypes = {
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

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Add);
