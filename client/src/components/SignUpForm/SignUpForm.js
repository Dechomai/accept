import './SingUpFrom.scss';

import React from 'react';
import {isEmpty, pick} from 'ramda';
import {withFormik} from 'formik';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import FileUpload from '../FileUpload/FileUpload';
import Icon from '../common/Icon/Icon';
import createValidator, {rules} from '../../utils/validation';
import userService from '../../services/user';

const InnerForm = ({
  values,
  errors,
  touched,
  isValid,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  error,
  loading,
  onPhotoSelect
}) => (
  <form
    onSubmit={handleSubmit}
    className={classNames('sign-up__form', {
      'sing-up__form--disabled': loading
    })}>
    {error &&
      isEmpty(touched) && (
        <div className="alert alert-danger" role="alert">
          Form is invalid
        </div>
      )}
    <FileUpload
      className="sign-up__form__photo"
      accept="image/jpeg,image/png,image/gif"
      maxSize={2.5 * 1024 * 1024} // ~2.5Mb
      onSelect={onPhotoSelect}>
      <div className="sign-up__form__photo__caption">
        <Icon name="camera" />
        <span>Upload photo</span>
      </div>
    </FileUpload>
    <h5 className="sign-up__form__title">Personal info</h5>
    <p className="sign-up__form__description">
      This information is private and will not be visible to other users
    </p>
    <div className="sign-up__form__name">
      <div className="row">
        <div className="col-md">
          <div className="form-group">
            <label>First name</label>
            <input
              className={classNames('form-control', {
                'is-invalid': touched.firstName && errors.firstName
              })}
              type="text"
              name="firstName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
            />
            {touched.firstName &&
              errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
        </div>
        <div className="col-md">
          <div className="form-group">
            <label>Last name</label>
            <input
              className={classNames('form-control', {
                'is-invalid': touched.lastName && errors.lastName
              })}
              type="text"
              name="lastName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
            />
            {touched.lastName &&
              errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>
      </div>
    </div>
    <div className="form-group">
      <label>Phone number</label>
      <small className="form-text text-muted">Enter your number</small>
      <input
        className={classNames('form-control', {
          'is-invalid': touched.phone && errors.phone
        })}
        type="text"
        name="phone"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.phone}
      />
      {touched.phone && errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
    </div>
    <div className="form-group">
      <label>Address</label>
      <small className="form-text text-muted">
        Enter a postcode or address line. Only information about your city will be visible to other
        users
      </small>
      <input
        className={classNames('form-control', {
          'is-invalid': touched.address && errors.address
        })}
        type="text"
        name="address"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.address}
      />
      {touched.address &&
        errors.address && <div className="invalid-feedback">{errors.address}</div>}
    </div>
    <h5 className="sign-up__form__title">Public info</h5>
    <p className="sign-up__form__description">This information will be visible to other users</p>
    <div className="form-group">
      <label>Username</label>
      <small className="form-text text-muted">
        Enter your unique username. This is how you will appear for other users.
      </small>
      <input
        className={classNames('form-control', {
          'is-invalid': touched.username && errors.username
        })}
        type="text"
        name="username"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.username}
      />
      {touched.username &&
        errors.username && <div className="invalid-feedback">{errors.username}</div>}
    </div>
    <div className="sign-up__footer">
      <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
        Create profile
      </button>
    </div>
  </form>
);

const SignUpForm = withFormik({
  mapPropsToValues: () => ({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    username: ''
  }),
  validate: createValidator({
    firstName: ['required', rules.minLength(2), rules.maxLength(50), 'lettersAndDigits'],
    lastName: ['required', rules.minLength(2), rules.maxLength(50), 'lettersAndDigits'],
    phone: [rules.minLength(3), rules.maxLength(20), 'digits'],
    address: [rules.minLength(5), rules.maxLength(100), 'lettersDigitsAndSpaces'],
    username: ['required', rules.minLength(3), rules.maxLength(40), 'lettersAndDigits']
  }),
  handleSubmit: (values, {props, setSubmitting, setTouched, setErrors}) => {
    const profile = pick(['firstName', 'lastName', 'phone', 'address', 'username'], values);
    userService.isUsernameUnique(values.username).then(data => {
      if (!data.unique) {
        setErrors({username: 'Username is not unique'});
        setSubmitting(false);
      } else {
        props.onSubmit(profile).catch(() => {
          setSubmitting(false);
          setTouched({});
        });
      }
    });
  }
})(InnerForm);

InnerForm.propTypes = {
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

SignUpForm.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  onSubmit: PropTypes.func.isRequired
};

export default SignUpForm;