import './Details.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button, Input, Breadcrumb, BreadcrumbItem} from 'reactstrap';

import Icon from '../common/Icon/Icon';
import Gallery from '../common/Gallery/Gallery';
import UserAvatar from '../UserAvatar/UserAvatar';

class ProductDetails extends React.Component {
  render() {
    const {product, isOwner} = this.props;

    return (
      <div className="container product-details">
        <div className="row">
          <Breadcrumb tag="nav" className="mb-3">
            <BreadcrumbItem active>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span">
              <Link to="/products">Products</Link>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="row product-details__header">
          <div className="col-12 d-flex justify-content-between">
            <Link className="product-details__seller" to={`/users/${product.createdBy.id}`}>
              <UserAvatar user={product.createdBy} />
              <span className="product-details__seller__username">
                {product.createdBy.username}
              </span>
            </Link>
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
            <Gallery
              photos={product.photos}
              primaryPhoto={product.photos.find(photo => photo.id === product.primaryPhotoId)}
              video={this.props.product.video}
            />
          </div>
          <div className="col-lg-5 offset-lg-1">
            <div className="product-details__top-section">
              <h5 className="product-details__title">{product.title}</h5>
              <div className="row d-flex align-items-center py-2">
                <div className="col-sm-3 col-6 product-details__property">Price</div>
                <div className="col-sm-3 col-6 product-details__price">
                  {product.price.toFixed(2)}
                </div>
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
                    <Button className="btn-with-icon btn-full-width" color="primary">
                      <Icon size="20" name="autorenew" />Exchange
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
  }
}

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductDetails;
