import React from 'react';
import {Link} from 'react-router';

import Button from '../components/Button/Button';

const Demo = () => {
  return (
    <div>
      <div>
        <Button>Primary Button</Button>
        <Button type="secondary">Secondary Button</Button>

        <Button size="small">Small Primary Button</Button>
        <Button type="secondary" size="small">
          Small Secondary Button
        </Button>
      </div>
      <br />
      <div>
        <Link to="/" className="base-link">
          Link example
        </Link>
      </div>
      <br />
      <div>
        <form>
          <div className="text-field">
            <label className="text-field__label">Email</label>
            <input className="text-field__input" type="text" placeholder="Enter your email" />
          </div>
          <div className="text-field">
            <label className="text-field__label">Email</label>
            <input
              className="text-field__input text-field__input--error"
              type="text"
              placeholder="Enter your email"
            />
            <p className="text-field__error">Please enter correct email address</p>
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
        </form>
      </div>
    </div>
  );
};

export default Demo;
