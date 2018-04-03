import React from 'react';
import classNames from 'classnames';

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
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industrys standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsu
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
