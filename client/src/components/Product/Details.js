import './Details.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button, Input} from 'reactstrap';

import Icon from '../common/Icon/Icon';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {product} = this.props;

    return (
      <div className="container product-details">
        <div className="row product-details__header">
          <span className="col-md-9 product-details__header__title">{product.title}</span>
          <Link className="col-md-3 d-flex justify-content-end" to={`/products/edit/${product.id}`}>
            <Button size="sm" color="link" className="p-0 btn-with-icon product-details__edit">
              <Icon name="pencil" size="20" />
              <span>Edit</span>
            </Button>
          </Link>
        </div>
        <div className="row product-details__content">
          <div className="col-lg-6 product-details__gallery">
            <div className="gallery" />
          </div>
          <div className="col-lg-5 offset-lg-1">
            <div className="product-details__top-section">
              <div className="row d-flex align-items-center py-2">
                <div className="col-sm-3 col-6 product-details__title">Price</div>
                <div className="col-sm-3 col-6 product-details__price">
                  {product.price.toFixed(2)}
                </div>
              </div>
              <div className="row d-flex align-items-center py-2">
                <div className="col-sm-3 col-6 product-details__title">Condition</div>
                <div className="col-sm-3 col-6 product-details__condition">{product.condition}</div>
              </div>
              <div className="row d-flex align-items-center py-2">
                <div className="col-sm-3 col-6 product-details__title">Quantity</div>
                <div className="col-sm-3 col-6 product-details__quantity">
                  <Input value={1} readOnly />
                </div>
              </div>
            </div>
            <div className="row product-details__bottom-section">
              <div className="col-12">
                <div className="product-details__title">Description</div>
                <div className="product-details__description">{product.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductDetails;
