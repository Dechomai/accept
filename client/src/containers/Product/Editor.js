import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, without, assoc, findIndex, propEq} from 'ramda';
import autobind from 'autobindr';

import {selectProductById, selectUserData} from '../../selectors';
import AddEditProductForm from '../../components/Product/Editor';
import PropTypes from 'prop-types';
import {createProduct, updateProduct, fetchProductById} from '../../actions/products';

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {photos: [], existingPhotos: [], removedPhotos: [], primaryPhotoIndex: 0};
  }

  componentDidMount() {
    const {params, product} = this.props;
    if (!product && params.productId) {
      this.props.fetchProductById(params.productId).then(() => {
        this.checkPermissionToEdit();
      });
    } else {
      this.checkPermissionToEdit();
    }
  }

  checkPermissionToEdit() {
    const {product, user, router} = this.props;
    if (product && product.data && product.data.createdBy.id === user.id) {
      this.setExistingPhotosToState(product);
    } else {
      router.push('/');
    }
  }

  setExistingPhotosToState(product) {
    this.setState({
      existingPhotos: product.data.photos,
      primaryPhotoIndex: findIndex(propEq('id', product.data.primaryPhotoId))(product.data.photos)
    });
  }

  handleFormSubmit(product) {
    if (this.props.params.productId) {
      const data = compose(
        assoc('removedPhotos', this.state.removedPhotos),
        assoc('newPhotos', this.state.photos),
        assoc('primaryPhotoIndex', this.state.primaryPhotoIndex)
      )(product);

      return this.props
        .updateProduct(data, this.props.params.productId, this.state.primaryPhotoIndex)
        .then(() => {
          this.props.router.push('/');
        });
    } else {
      return this.props
        .createProduct(product, this.state.photos, this.state.primaryPhotoIndex)
        .then(() => {
          this.props.router.push('/');
        });
    }
  }

  handlePhotosAdded(photos) {
    this.setState({photos});
  }

  handlePhotoDelete(photo) {
    let deletedIndex = null;
    let {primaryPhotoIndex} = this.state;
    const isExistingPhoto = !!photo.id;

    if (isExistingPhoto) {
      deletedIndex = this.state.existingPhotos.indexOf(photo);
    } else {
      deletedIndex = this.state.photos.indexOf(photo) + this.state.existingPhotos.length;
    }

    if (primaryPhotoIndex > deletedIndex) {
      primaryPhotoIndex -= 1;
    } else if (primaryPhotoIndex === deletedIndex) {
      primaryPhotoIndex = 0;
    }

    if (isExistingPhoto) {
      this.setState({
        existingPhotos: without([photo], this.state.existingPhotos),
        primaryPhotoIndex,
        removedPhotos: this.state.removedPhotos.concat(photo.id)
      });
    } else {
      this.setState({
        photos: without([photo], this.state.photos),
        primaryPhotoIndex
      });
    }
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
        existingPhotos={this.state.existingPhotos}
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
  createProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    product: selectProductById(state, ownProps.params.productId),
    user: selectUserData(state)
  };
};

const mapDispatchToProps = dispatch => ({
  createProduct(product, files, primaryPhotoIndex) {
    return dispatch(createProduct(product, files, primaryPhotoIndex));
  },
  updateProduct(product, productId, primaryPhotoIndex) {
    return dispatch(updateProduct(product, productId, primaryPhotoIndex));
  },
  fetchProductById(productId) {
    return dispatch(fetchProductById(productId));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AddEdit);
