import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, without, assoc, findIndex, propEq} from 'ramda';
import autobind from 'autobindr';

import {selectServiceById, selectProfile} from '../../selectors';
import ServiceEditor from '../../components/Service/Editor';
import {createService, updateService, fetchServiceById} from '../../actions/services';
import Loader from '../../components/common/Loader/Loader';

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {photos: [], existingPhotos: [], removedPhotos: [], primaryPhotoIndex: 0};
  }

  componentDidMount() {
    const {params, service} = this.props;
    if (!params.serviceId) return;

    if (!service || (service && !service.data)) {
      this.props.fetchPServiceById(params.serviceId).then(() => {
        this.checkPermissionToEdit();
      });
    } else {
      this.checkPermissionToEdit();
    }
  }

  checkPermissionToEdit() {
    const {service, user, router} = this.props;
    if (service && service.data && service.data.createdBy.id === user.data.id) {
      this.setExistingPhotosToState(service);
    } else {
      router.push('/');
    }
  }

  setExistingPhotosToState(service) {
    this.setState({
      existingPhotos: service.data.photos,
      primaryPhotoIndex: findIndex(propEq('id', service.data.primaryPhotoId))(service.data.photos)
    });
  }

  handleFormSubmit(service) {
    const {serviceId} = this.props.params;
    if (serviceId) {
      const data = compose(
        assoc('removedPhotos', this.state.removedPhotos),
        assoc('newPhotos', this.state.photos),
        assoc('primaryPhotoIndex', this.state.primaryPhotoIndex)
      )(service);

      return this.props.updateService(data, serviceId, this.state.primaryPhotoIndex).then(() => {
        this.props.router.push(`/services/${serviceId}`);
      });
    } else {
      return this.props
        .createService(service, this.state.photos, this.state.primaryPhotoIndex)
        .then(() => {
          this.props.router.push(`/profile`);
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
    const {service, params: {serviceId}} = this.props;
    if ((serviceId && !service) || (service && (service.loading && !service.data)))
      return <Loader />;
    return (
      <ServiceEditor
        onSubmit={this.handleFormSubmit}
        photos={this.state.photos}
        existingPhotos={this.state.existingPhotos}
        primaryPhotoIndex={this.state.primaryPhotoIndex}
        service={service}
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
  createService: PropTypes.func.isRequired,
  updateService: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    service: selectServiceById(state, ownProps.params.serviceId),
    user: selectProfile(state)
  };
};

const mapDispatchToProps = dispatch => ({
  createService(service, files, primaryPhotoIndex) {
    return dispatch(createService(service, files, primaryPhotoIndex));
  },
  updateService(service, serviceId, primaryPhotoIndex) {
    return dispatch(updateService(service, serviceId, primaryPhotoIndex));
  },
  fetchServiceById(serviceId) {
    return dispatch(fetchServiceById(serviceId));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AddEdit);
