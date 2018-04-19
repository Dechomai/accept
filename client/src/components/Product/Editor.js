import React from 'react';
import {range, pick, assoc} from 'ramda';
import classNames from 'classnames';
import {withFormik} from 'formik';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {Button} from 'reactstrap';

import Icon from '../common/Icon/Icon';
import FileUpload from '../common/FileUpload/FileUpload';
import Loader from '../common/Loader/Loader';
import {rules} from '../../utils/validation';
import createValidator from '../../utils/validation';
import Tile from '../common/Tile/Tile';
import {getImageThumbnail} from '../../utils/img';

const MAX_PHOTOS = 8;

class InnerForm extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleUploadPhoto(files) {
    const photos = this.props.photos.concat(files).slice(0, 8 - this.props.existingPhotos.length);
    this.props.onPhotosAdded(photos);
  }

  renderEmptyPhotoPlaceholders() {
    return range(
      0,
      MAX_PHOTOS - (this.props.photos.length + this.props.existingPhotos.length) - 1
    ).map(item => (
      <Tile sizes="col-3" key={item}>
        <div className="create-form__placeholder">
          <Icon name="image" size="64" />
        </div>
      </Tile>
    ));
  }

  renderPhotos() {
    const {
      photos,
      primaryPhotoIndex,
      existingPhotos,
      onPrimaryPhotoIndexChanged,
      onPhotoDelete
    } = this.props;
    return photos.map((photo, index) => (
      <Tile key={photo.preview} sizes="col-3">
        <div
          style={{backgroundImage: `url(${photo.preview})`}}
          className="create-form__placeholder create-form__placeholder--with-photo">
          <div className="create-form__placeholder__close" onClick={() => onPhotoDelete(photo)}>
            <Icon name="close" size="20" />
          </div>
          <button
            type="button"
            className={classNames('btn btn-sm btn-primary btn-round', {
              'btn-dark create-form__placeholder--primary':
                primaryPhotoIndex - existingPhotos.length === index
            })}
            onClick={() => onPrimaryPhotoIndexChanged(index + existingPhotos.length)}>
            {primaryPhotoIndex - existingPhotos.length === index ? 'Primary' : 'Make Primary'}
          </button>
        </div>
      </Tile>
    ));
  }

  renderExistingPhotos() {
    const {
      primaryPhotoIndex,
      existingPhotos,
      onPrimaryPhotoIndexChanged,
      onPhotoDelete
    } = this.props;

    return existingPhotos.map((photo, index) => (
      <Tile key={photo.url} sizes="col-3">
        <div
          style={{backgroundImage: `url(${getImageThumbnail(photo.url)})`}}
          className="create-form__placeholder create-form__placeholder--with-photo">
          <div className="create-form__placeholder__close" onClick={() => onPhotoDelete(photo)}>
            <Icon name="close" size="20" />
          </div>
          <button
            type="button"
            className={classNames('btn btn-sm btn-primary btn-round', {
              'btn-dark create-form__placeholder--primary': primaryPhotoIndex === index
            })}
            onClick={() => onPrimaryPhotoIndexChanged(index)}>
            {primaryPhotoIndex === index ? 'Primary' : 'Make Primary'}
          </button>
        </div>
      </Tile>
    ));
  }

  render() {
    const {
      values,
      errors,
      touched,
      isValid,
      isSubmitting,
      handleChange,
      handleBlur,
      handleSubmit,
      onCancelClick
    } = this.props;
    return (
      <form
        className={classNames('create-form', {
          'create-form--disabled': isSubmitting
        })}>
        {isSubmitting && <Loader />}
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-form__label">
                <span className="create-form__label__name">Title </span>
                <span className="create-form__label__required">(required)</span>
                <p className="create-form__label__description">To help buyers find your item</p>
              </div>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="create-form__content">
                <div className="form-group">
                  <label>Enter title</label>
                  <input
                    className={classNames('form-control', {
                      'is-invalid': touched.title && errors.title
                    })}
                    type="text"
                    placeholder="Caption"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                  />
                  {touched.title &&
                    errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-form__label">
                <span className="create-form__label__name">Add photos </span>
                <span className="create-form__label__required">(optional)</span>
                <p className="create-form__label__description">
                  Use up to ten photos to show your items most important qualities
                </p>
              </div>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="create-form__content">
                <div className="container-fluid create-form__upload-photos">
                  <div className="row">
                    {this.renderExistingPhotos()}
                    {this.renderPhotos()}
                    {this.props.photos.length + this.props.existingPhotos.length < MAX_PHOTOS && (
                      <Tile sizes="col-3">
                        <FileUpload
                          className="create-form__placeholder"
                          accept="image/jpeg,image/png,image/gif"
                          multiple={true}
                          showPreview={false}
                          maxSize={2.5 * 1024 * 1024} // ~2.5Mb
                          onSelect={this.handleUploadPhoto}>
                          <div className="create-form__placeholder__caption">
                            <Icon name="upload" size="20" />
                            <small className="create-form__placeholder__upload-label">
                              Upload photo
                            </small>
                          </div>
                        </FileUpload>
                      </Tile>
                    )}
                    {this.renderEmptyPhotoPlaceholders()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-form__label">
                <span className="create-form__label__name">Add video </span>
                <span className="create-form__label__required">(optional)</span>
              </div>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="create-form__content">
                <div className="form-group">
                  <label>Upload Video with Youtube</label>
                  <input
                    className={classNames('form-control', {
                      'is-invalid': touched.video && errors.video
                    })}
                    type="text"
                    placeholder="YouTube video URL"
                    name="video"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.video}
                  />
                  {touched.video &&
                    errors.video && <div className="invalid-feedback">{errors.video}</div>}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-form__label">
                <span className="create-form__label__name">Describe your item </span>
                <span className="create-form__label__required">(required)</span>
                <p className="create-form__label__description">
                  Describe your item to potential buyers
                </p>
              </div>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="create-form__content">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className={classNames('form-control', {
                      'is-invalid': touched.description && errors.description
                    })}
                    type="text"
                    rows="4"
                    placeholder="Describe item..."
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                  />
                  {touched.description &&
                    errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-form__label">
                <span className="create-form__label__name">Condition </span>
                <span className="create-form__label__required">(required)</span>
                <p className="create-form__label__description">
                  Select the condition of the item you are listing
                </p>
              </div>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="create-form__content">
                <div className="radio-field">
                  <label className="radio-field__label">
                    New
                    <input
                      className="radio-field__input"
                      name="condition"
                      type="radio"
                      value="new"
                      checked={values.condition === 'new'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="radio-field__checkmark" />
                  </label>
                </div>
                <div className="radio-field">
                  <label className="radio-field__label">
                    Used
                    <input
                      className="radio-field__input"
                      name="condition"
                      value="used"
                      checked={values.condition === 'used'}
                      type="radio"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="radio-field__checkmark" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-form__label">
                <span className="create-form__label__name">Price </span>
                <span className="create-form__label__required">(required)</span>
              </div>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="create-form__content">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    className={classNames('form-control', {
                      'is-invalid': touched.price && errors.price
                    })}
                    type="text"
                    placeholder="00.00"
                    name="price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                  />
                  {touched.price &&
                    errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="create-form__footer">
          <div className="container">
            <div className="text-right">
              <Button color="link" onClick={onCancelClick}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit} disabled={isSubmitting || !isValid}>
                Publish
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const ProductEditor = withFormik({
  enableReinitialize: true,
  isInitialValid: props => {
    return props.product && !!props.product.data;
  },
  mapPropsToValues: props => {
    const {product} = props;

    if (product && product.data) {
      const productData = pick(
        ['title', 'video', 'description', 'condition', 'price'],
        product.data
      );
      return assoc(
        'video',
        productData.video ? `https://youtu.be/${productData.video}` : '',
        productData
      );
    }

    return {
      title: '',
      video: '',
      description: '',
      condition: 'new',
      price: ''
    };
  },
  validate: createValidator({
    title: ['required', rules.minLength(3), rules.maxLength(400), 'lettersDigitsAndSpaces'],
    video: ['youtubeUrl'],
    description: ['required', rules.minLength(10), rules.maxLength(800), 'lettersDigitsAndSpaces'],
    price: ['required', 'price']
  }),
  handleSubmit: (values, {props, setSubmitting, setTouched}) => {
    const product = pick(['title', 'video', 'photos', 'description', 'condition', 'price'], values);
    props.onSubmit(product).catch(() => {
      setSubmitting(false);
      setTouched({});
    });
  }
})(InnerForm);

InnerForm.propTypes = {
  values: PropTypes.any,
  errors: PropTypes.any,
  touched: PropTypes.object,
  isValid: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  onCancelClick: PropTypes.func
};

ProductEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  photos: PropTypes.array,
  primaryPhotoIndex: PropTypes.number,
  onPhotosAdded: PropTypes.func,
  onPrimaryPhotoIndexChanged: PropTypes.func,
  onPhotoDelete: PropTypes.func,
  onCancelClick: PropTypes.func
};

export default ProductEditor;
