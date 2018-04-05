import React from 'react';
import {range, without, pick} from 'ramda';
import classNames from 'classnames';
import Icon from '../common/Icon/Icon';
import {withFormik} from 'formik/dist/formik';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import autobind from 'autobindr';

import FileUpload from '../FileUpload/FileUpload';
import {rules} from '../../utils/validation';
import createValidator from '../../utils/validation';

const MAX_PHOTOS = 8;

class InnerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: []
    };

    autobind(this);
  }

  removeAddedPhoto(photo) {
    this.setState({
      photos: without([photo], this.state.photos)
    });
  }

  renderEmptyPhotoPlaceholders() {
    return range(0, MAX_PHOTOS - this.state.photos.length).map(item => (
      <div key={item} className="create-form__placeholder">
        <Icon name="image" size="64" />
      </div>
    ));
  }

  renderPhotos() {
    return this.state.photos.map(photo => (
      <div
        key={photo.uri}
        className="create-form__placeholder create-form__placeholder--with-photo">
        <img className="file-upload__preview" src={photo.uri} alt="" />
        <div
          className="create-form__placeholder__close"
          onClick={() => this.removeAddedPhoto(photo)}>
          <Icon name="close" size="20" />
        </div>
      </div>
    ));
  }

  handleUploadPhoto(photo) {
    this.setState(
      {
        photos: this.state.photos.concat([
          {
            uri: photo.preview,
            primary: false
          }
        ])
      },
      () => {
        this.props.onPhotoAdded(this.state.photos);
      }
    );
  }

  render() {
    const {
      values,
      errors,
      touched,
      isValid,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting
    } = this.props;
    return (
      <form className="create-form">
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
                <div className="create-form__upload-photos">
                  {this.renderPhotos()}
                  {this.state.photos.length < MAX_PHOTOS && (
                    <FileUpload
                      className="create-form__placeholder"
                      accept="image/jpeg,image/png,image/gif"
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
                  )}
                  {this.renderEmptyPhotoPlaceholders()}
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
              <Link to="/" className="btn btn-link btn-cancel">
                Cancel
              </Link>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}>
                Publish
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const AddProductFrom = withFormik({
  mapPropsToValues: () => ({
    title: '',
    video: '',
    description: '',
    condition: 'new',
    price: ''
  }),
  validate: createValidator({
    title: ['required', rules.minLength(3), rules.maxLength(400), 'lettersDigitsAndSpaces'],
    video: ['required', 'youtubeUrl'],
    description: ['required', rules.minLength(10), rules.maxLength(800), 'lettersDigitsAndSpaces'],
    price: ['required', 'price']
  }),
  handleSubmit: (values, {props, setSubmitting, setTouched}) => {
    const product = pick(['title', 'video', 'photos', 'description', 'condition', 'price'], values);
    props.onSubmit(product).catch(() => {
      setSubmitting(false);
      setTouched({});
    });
    setSubmitting(false);
  }
})(InnerForm);

InnerForm.propTypes = {
  photos: PropTypes.string,
  values: PropTypes.any,
  errors: PropTypes.any,
  touched: PropTypes.object,
  isValid: PropTypes.bool,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  error: PropTypes.any,
  loading: PropTypes.bool
};

AddProductFrom.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  onSubmit: PropTypes.func.isRequired
};

export default AddProductFrom;
