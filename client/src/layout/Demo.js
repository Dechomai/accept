import React from 'react';
import {Link} from 'react-router';
import {Button} from 'reactstrap';

const Demo = () => {
  return (
    <div className="container">
      <div>
        <Button color="primary">Primary Button</Button>
        <Button>Secondary Button</Button>

        <Button color="primary" size="sm">
          Small Primary Button
        </Button>
        <Button color="secondary" size="sm">
          Small Secondary Button
        </Button>
      </div>
      <br />
      <div>
        <Link to="/" className="btn btn-link">
          Link example
        </Link>
      </div>
      <br />
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" />
            <small className="form-text text-muted">
              Well never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control is-invalid" placeholder="Enter email" />
            <div className="invalid-feedback">Please choose a username.</div>
          </div>
          <br />
          <div>
            <div className="checkbox-field">
              <label className="checkbox-field__label">
                Label
                <input
                  className="field-checkbox__input"
                  name="example"
                  type="checkbox"
                  defaultChecked
                />
                <span className="checkbox-field__checkmark" />
              </label>
            </div>
            <div className="checkbox-field">
              <label className="checkbox-field__label">
                Label
                <input className="field-checkbox__input" name="example" type="checkbox" />
                <span className="checkbox-field__checkmark" />
              </label>
            </div>
            <div className="checkbox-field">
              <label className="checkbox-field__label">
                Label
                <input className="field-checkbox__input" name="example" type="checkbox" />
                <span className="checkbox-field__checkmark" />
              </label>
            </div>
          </div>
          <br />
          <div>
            <div className="radio-field">
              <label className="radio-field__label">
                Label
                <input className="radio-field__input" name="example-radio" type="radio" />
                <span className="radio-field__checkmark" />
              </label>
            </div>
            <div className="radio-field">
              <label className="radio-field__label">
                Label
                <input className="radio-field__input" name="example-radio" type="radio" />
                <span className="radio-field__checkmark" />
              </label>
            </div>
            <div className="radio-field">
              <label className="radio-field__label">
                Label
                <input className="radio-field__input" name="example-radio" type="radio" />
                <span className="radio-field__checkmark" />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Demo;
