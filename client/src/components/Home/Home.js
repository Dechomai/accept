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
    if (!products || products.loading) return <Loader />;
    if (products.data)
      return <ItemsList type="products" list={products.data} tileSize="col-4 col-md-2" />;
  }

  getServices() {
    const {services} = this.props;
    if (!services || services.loading) return <Loader />;
    if (services.data)
      return <ItemsList type="services" list={services.data} tileSize="col-4 col-md-2" />;
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
            <div className="row home__products__row">{this.getProducts()}</div>
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
          </div>

          <div className="home__services">
            <div className="row">
              <div className="col-12 mb-4">
                <h3>Services</h3>
              </div>
            </div>
            <div className="row">{this.getServices()}</div>
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
