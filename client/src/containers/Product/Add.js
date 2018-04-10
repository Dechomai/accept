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
    this.state = {photos: []};
  }

  handleFormSubmit(product) {
    const photosFolder = uuidv4();
    let data = assoc('photosFolder', photosFolder, product);

    return this.props.createProduct(data, this.state.photos).then(() => {
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
  status: selectProductStatus(state)
});

const mapDispatchToProps = dispatch => ({
  createProduct(product, files) {
    return dispatch(createProduct(product, files));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Add);
