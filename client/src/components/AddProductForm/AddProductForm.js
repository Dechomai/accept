import React from 'react';
import classNames from 'classnames';
import Icon from '../common/Icon/Icon';

const AddProductFrom = () => {
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
                  className={classNames('form-control')}
                  type="text"
                  placeholder="Caption"
                  name="title"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-sm-12">
            <div className="create-form__label">
              <span className="create-form__label__name">Add photos </span>
              <span className="create-form__label__required">(required)</span>
              <p className="create-form__label__description">
                Use up to ten photos to show your items most important qualities
              </p>
            </div>
          </div>
          <div className="col-md-9 col-sm-12">
            <div className="create-form__content">
              <div className="create-form__upload-photos">
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
                <div className="create-form__photo">
                  <Icon name="image" size="64" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-sm-12">
            <div className="create-form__label">
              <span className="create-form__label__name">Add photos </span>
              <span className="create-form__label__required">(optional)</span>
            </div>
          </div>
          <div className="col-md-9 col-sm-12">
            <div className="create-form__content">
              <div className="form-group">
                <label>Upload Video with Youtube</label>
                <input
                  className={classNames('form-control')}
                  type="text"
                  placeholder="YouTube video URL"
                  name="uploadVideo"
                />
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
                  className={classNames('form-control')}
                  type="text"
                  rows="4"
                  placeholder="Describe item..."
                  name="description"
                />
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
                    defaultChecked
                  />
                  <span className="radio-field__checkmark" />
                </label>
              </div>
              <div className="radio-field">
                <label className="radio-field__label">
                  Used
                  <input className="radio-field__input" name="condition" type="radio" />
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
                  className={classNames('form-control col-2')}
                  type="text"
                  placeholder="00"
                  name="price"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="create-form__footer">
        <div className="container">
          <div className="text-right">
            <button className="btn btn-link btn-cancel">Cancel</button>
            <button className="btn btn-primary">Publish</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProductFrom;
