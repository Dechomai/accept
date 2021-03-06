import './Details.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button, Input, Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {getOrderedPhotos} from '../../utils/img';

import Icon from '../common/Icon/Icon';
import Gallery from '../common/Gallery/Gallery';
import UserLink from '../common/UserLink/UserLink';

const ProductDetails = ({isSignedIn, product, isOwner, onExchangeClick}) => (
  <div className="container product-details">
    <div className="row">
      <Breadcrumb tag="nav" className="mb-3">
        <BreadcrumbItem>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/products">Products</Link>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div className="row product-details__header">
      <div className="col-12 d-flex justify-content-between">
        <UserLink user={product.createdBy} isOwner={isOwner} />
        {isOwner && (
          <Link className="d-flex justify-content-end" to={`/products/${product.id}/edit`}>
            <Button size="sm" color="link" className="p-0 btn-with-icon product-details__edit">
              <Icon name="pencil" size="20" />
              <span>Edit</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
    <div className="row product-details__content">
      <div className="col-lg-6 product-details__gallery">
        <Gallery photos={getOrderedPhotos(product)} video={product.video} />
      </div>
      <div className="col-lg-5 offset-lg-1">
        <div className="product-details__top-section">
          <h5 className="product-details__title">{product.title}</h5>
          <div className="row d-flex align-items-center py-2">
            <div className="col-sm-3 col-6 product-details__property">Price</div>
            <div className="col-sm-3 col-6 product-details__price">{product.price.toFixed(2)}</div>
          </div>
          <div className="row d-flex align-items-center py-2">
            <div className="col-sm-3 col-6 product-details__property">Condition</div>
            <div className="col-sm-3 col-6 product-details__condition">{product.condition}</div>
          </div>
          {!isOwner && (
            <div className="row d-flex align-items-center py-2">
              <div className="col-sm-3 col-6 product-details__property">Quantity</div>
              <div className="col-sm-3 col-6 product-details__quantity">
                <Input value={1} readOnly />
              </div>
            </div>
          )}
          {!isOwner && (
            <div className="row d-flex align-items-center py-3">
              <div className="col-12 product-details__exchange">
                <Button
                  className="btn-with-icon btn-full-width"
                  color="primary"
                  onClick={onExchangeClick}
                  disabled={!isSignedIn}>
                  <Icon size="20" name="autorenew" />
                  Exchange
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="row product-details__bottom-section">
          <div className="col-12">
            <div className="product-details__property">Description</div>
            <div className="product-details__description">{product.description}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

ProductDetails.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onExchangeClick: PropTypes.func
};

export default ProductDetails;
