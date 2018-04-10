import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, without, assoc} from 'ramda';
import autobind from 'autobindr';
import uuidv4 from 'uuid/v4';

import AddProductForm from '../../components/Product/AddForm';
import {selectProductStatus} from '../../selectors';
import PropTypes from 'prop-types';
import {createProduct} from '../../actions/product';

class Add extends React.Component {
  constructor() {
    super();
    autobind(this);
    this.state = {photos: [], primaryPhotoIndex: 0};
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
      <AddProductForm
        loading={this.props.status.loading}
        error={this.props.status.error}
        onSubmit={this.handleFormSubmit}
        photos={this.state.photos}
        primaryPhotoIndex={this.state.primaryPhotoIndex}
        onPhotosAdded={this.handlePhotosAdded}
        onPrimaryPhotoIndexChanged={this.handlePrimaryPhotoIndexChanged}
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
  status: selectProductStatus(state)
});

const mapDispatchToProps = dispatch => ({
  createProduct(product, files, primaryPhotoIndex) {
    return dispatch(createProduct(product, files, primaryPhotoIndex));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Add);
