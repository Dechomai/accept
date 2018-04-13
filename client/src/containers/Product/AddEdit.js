import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, without, assoc} from 'ramda';
import autobind from 'autobindr';
import uuidv4 from 'uuid/v4';

import {selectOwnProductById} from '../../selectors';
import AddEditProductForm from '../../components/Product/AddEditForm';
import PropTypes from 'prop-types';
import {createProduct, fetchProductById} from '../../actions/products';

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {photos: [], primaryPhotoIndex: 0};
  }

  componentDidMount() {
    const {params, product} = this.props;
    if (!product && params.productId) {
      this.props.fetchProductById(params.productId);
    }
  }

  handleFormSubmit(product) {
    const photosFolder = uuidv4();
    let data = assoc('photosFolder', photosFolder, product);

    return this.props
      .createProduct(data, this.state.photos, this.state.primaryPhotoIndex)
      .then(() => {
        this.props.router.push('/');
      });
  }

  handlePhotosAdded(photos) {
    this.setState({photos});
  }

  handlePhotoDelete(photo) {
    let {primaryPhotoIndex} = this.state;
    const deletedIndex = this.state.photos.indexOf(photo);
    if (primaryPhotoIndex > deletedIndex) {
      primaryPhotoIndex -= 1;
    } else if (primaryPhotoIndex === deletedIndex) {
      primaryPhotoIndex = 0;
    }

    this.setState({
      photos: without([photo], this.state.photos),
      primaryPhotoIndex
    });
  }

  handleCancelClick() {
    this.props.router.goBack();
  }

  handlePrimaryPhotoIndexChanged(index) {
    this.setState({
      primaryPhotoIndex: index
    });
  }

  render() {
    return (
      <AddEditProductForm
        onSubmit={this.handleFormSubmit}
        photos={this.state.photos}
        primaryPhotoIndex={this.state.primaryPhotoIndex}
        product={this.props.product}
        onPhotosAdded={this.handlePhotosAdded}
        onPrimaryPhotoIndexChanged={this.handlePrimaryPhotoIndexChanged}
        onPhotoDelete={this.handlePhotoDelete}
        onCancelClick={this.handleCancelClick}
      />
    );
  }
}

AddEdit.propTypes = {
  router: PropTypes.any,
  createProduct: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    product: selectOwnProductById(state, ownProps.params.productId)
  };
};

const mapDispatchToProps = dispatch => ({
  createProduct(product, files, primaryPhotoIndex) {
    return dispatch(createProduct(product, files, primaryPhotoIndex));
  },
  fetchProductById(productId) {
    return dispatch(fetchProductById(productId));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AddEdit);
