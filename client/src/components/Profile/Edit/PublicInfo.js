import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {toast} from 'react-toastify';
import classNames from 'classnames';
import {withFormik} from 'formik';
import {compose, filter, pick, not, isEmpty} from 'ramda';

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
  handleSubmit
}) => (
  <React.Fragment>
    <form
      className={classNames('public-info__form', {
        'public-info__form--disabled': loading
      })}>
      <div className="form-group">
        <label>Username</label>
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
        {touched.username && errors.username && (
          <div className="invalid-feedback">{errors.username}</div>
        )}
      </div>
      <div className="form-group">
        <label>Location</label>
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
        {touched.address && errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
      </div>
    </form>
    <Button color="primary" onClick={handleSubmit} disabled={isSubmitting || !isValid}>
      Save changes
    </Button>
  </React.Fragment>
);

const PublicInfoForm = withFormik({
  mapPropsToValues: ({username, address}) => ({
    username,
    address
  }),
  validate: createValidator({
    username: ['required', rules.minLength(3), rules.maxLength(40), 'alphanumeric'],
    address: ['required', rules.minLength(5), rules.maxLength(100), 'commonText']
  }),
  handleSubmit: (values, {props, setSubmitting, setTouched}) => {
    const publicInfo = compose(
      filter(compose(not, isEmpty)),
      pick(['username', 'address'])
    )(values);

    props.onSubmit(publicInfo).then(
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

PublicInfoForm.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  onSubmit: PropTypes.func.isRequired
};

export default PublicInfoForm;
