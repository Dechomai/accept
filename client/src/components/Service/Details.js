import './Details.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button, Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {getOrderedPhotos} from '../../utils/img';

import Icon from '../common/Icon/Icon';
import Gallery from '../common/Gallery/Gallery';
import UserAvatar from '../UserAvatar/UserAvatar';

class ServiceDetails extends React.Component {
  render() {
    const {service, isOwner} = this.props;

    return (
      <div className="container service-details">
        <div className="row">
          <Breadcrumb tag="nav" className="mb-3">
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/services">Services</Link>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="row service-details__header">
          <div className="col-12 d-flex justify-content-between">
            <Link
              className="service-details__seller"
              to={isOwner ? '/profile' : `/users/${service.createdBy.id}`}>
              <UserAvatar user={service.createdBy} />
              <span className="service-details__seller__username">
                {service.createdBy.username}
              </span>
            </Link>
            {isOwner && (
              <Link className="d-flex justify-content-end" to={`/services/${service.id}/edit`}>
                <Button size="sm" color="link" className="p-0 btn-with-icon service-details__edit">
                  <Icon name="pencil" size="20" />
                  <span>Edit</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="row service-details__content">
          <div className="col-lg-6 service-details__gallery">
            <Gallery photos={getOrderedPhotos(service)} video={service.video} />
          </div>
          <div className="col-lg-5 offset-lg-1">
            <div className="service-details__top-section">
              <h5 className="service-details__title">{service.title}</h5>
              <div className="row d-flex align-items-center py-2">
                <div className="col-sm-3 col-4 service-details__property">Price</div>
                <div className="col-sm-9 col-8 service-details__price">
                  <span className="service-details__price__value">{service.price.toFixed(2)}</span>
                  <span className="service-details__price__per"> / hour</span>
                </div>
              </div>
              {!isOwner && (
                <div className="row d-flex align-items-center py-3">
                  <div className="col-12 service-details__exchange">
                    <Button className="btn-with-icon btn-full-width" color="primary">
                      <Icon size="20" name="autorenew" />Exchange
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="row service-details__bottom-section">
              <div className="col-12">
                <div className="service-details__property">Description</div>
                <div className="service-details__description">{service.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ServiceDetails.propTypes = {
  service: PropTypes.object.isRequired
};

export default ServiceDetails;
