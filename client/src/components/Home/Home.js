import './Home.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button} from 'reactstrap';

import TopBanner from './TopBanner';
import BottomBanner from './BottomBanner';
import Icon from '../common/Icon/Icon';
import Loader from '../common/Loader/Loader';
import ItemsList from '../common/Item/List';
import Empty from '../common/Empty/Empty';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {products, services} = this.props;
    if (!products || (products && !products.listValid)) {
      this.props.fetchProducts();
    }
    if (!services || (services && !services.listValid)) {
      this.props.fetchServices();
    }
  }

  getProducts() {
    const {products} = this.props;

    if (!products || products.loading) {
      return (
        <div className="row home__products__row">
          <Loader />
        </div>
      );
    }
    if (products.data && products.data.length) {
      return (
        <React.Fragment>
          <div className="row home__products__row">
            <ItemsList type="products" list={products.data} tileSize="col-4 col-md-2" />
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <Link to="/products">
                <Button size="sm" color="link" className="p-0 mt-4 btn-with-icon">
                  <span>See more</span>
                  <Icon name="arrow-right" size="20" />
                </Button>
              </Link>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <div className="row home__products__row">
        <Empty type="product" />
      </div>
    );
  }

  getServices() {
    const {services} = this.props;

    if (!services || services.loading) {
      return (
        <div className="row home__services__row">
          <Loader />
        </div>
      );
    }
    if (services.data && services.data.length) {
      return (
        <React.Fragment>
          <div className="row home__services__row">
            <ItemsList type="services" list={services.data} tileSize="col-4 col-md-2" />
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <Link to="/services">
                <Button size="sm" color="link" className="p-0 mt-4 btn-with-icon">
                  <span>See more</span>
                  <Icon name="arrow-right" size="20" />
                </Button>
              </Link>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <div className="row home__services__row">
        <Empty type="service" />
      </div>
    );
  }

  render() {
    const {user} = this.props;
    return (
      <div className="home">
        <div className="container">
          {(!user || !user.data) && <TopBanner />}

          <div className="home__products">
            <div className="row">
              <div className="col-12 mb-4">
                <h3>Products</h3>
              </div>
            </div>
            {this.getProducts()}
          </div>

          <div className="home__services">
            <div className="row">
              <div className="col-12 mb-4">
                <h3>Services</h3>
              </div>
            </div>
            {this.getServices()}
          </div>

          <BottomBanner />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  user: PropTypes.object
};

export default Home;
