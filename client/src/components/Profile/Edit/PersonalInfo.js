import './PersonalInfo.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {toast} from 'react-toastify';
import classNames from 'classnames';
import {withFormik} from 'formik';
import {compose, filter, pick, not, isEmpty} from 'ramda';

import FileUpload from '../../common/FileUpload/FileUpload';
import Icon from '../../common/Icon/Icon';
import createValidator, {rules} from '../../../utils/validation';

const InnerForm = ({
  loading,
  isSubmitting,
  isValid,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldTouched,
  setFieldValue
}) => (
  <React.Fragment>
    <form
      className={classNames('personal-info__form', {
        'personal-info__form--disabled': loading
      })}>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="row">
            <div className="col-12 col-lg-6">
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
            <div className="col-12 col-lg-6">
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
          <div className="row">
            <div className="col-12">
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
                {touched.phone &&
                  errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 text-center">
          <div className="form-group">
            <label>photo/avatar</label>
            <div>
              <FileUpload
                className="personal-info__form__photo"
                accept="image/jpeg,image/png,image/gif"
                maxSize={2.5 * 1024 * 1024} // ~2.5Mb
                imgUrl={typeof values.avatar === 'string' ? values.avatar : null} // do not pass File object, only url
                onReject={() => {
                  setFieldTouched('avatar', true);
                  setFieldValue(
                    'avatar',
                    new Error('Photos should be less than 2.5Mb in .jpeg or .png format')
                  );
                }}
                onSelect={file => {
                  setFieldTouched('avatar', true);
                  setFieldValue('avatar', file);
                }}>
                <div className="personal-info__form__photo__caption">
                  <Icon name="camera" />
                  <span>Upload photo</span>
                </div>
              </FileUpload>
            </div>
            {touched.avatar &&
              errors.avatar && <div className="invalid-feedback">{errors.avatar}</div>}
          </div>
        </div>
      </div>
    </form>
    <Button color="primary" onClick={handleSubmit} disabled={isSubmitting || !isValid}>
      Save changes
    </Button>
  </React.Fragment>
);

const PersonalInfoForm = withFormik({
  mapPropsToValues: ({firstName, lastName, phone, photoUrl}) => ({
    firstName,
    lastName,
    phone,
    avatar: photoUrl
  }),
  validate: createValidator({
    firstName: ['required', rules.minLength(2), rules.maxLength(50), 'lettersAndDigits'],
    lastName: ['required', rules.minLength(2), rules.maxLength(50), 'lettersAndDigits'],
    phone: [rules.minLength(3), rules.maxLength(20), 'digits'],
    avatar: [avatar => (avatar instanceof Error ? avatar.message : null)]
  }),
  handleSubmit: (values, {props, setSubmitting, setTouched}) => {
    const personalInfo = compose(
      filter(compose(not, isEmpty)),
      pick(['firstName', 'lastName', 'phone', 'avatar'])
    )(values);

    props.onSubmit(personalInfo).then(
      () => {
        toast.success('Profile updated successfuly');
        setSubmitting(false);
        setTouched({});
      },
      () => {
        toast.error('Sorry, something went wrong');
        setSubmitting(false);
        setTouched({});
      }
    );
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

PersonalInfoForm.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  onSubmit: PropTypes.func.isRequired
};

export default PersonalInfoForm;
