import './Home.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button} from 'reactstrap';

import TopBanner from './TopBanner';
import BottomBanner from './BottomBanner';
import ItemTile from '../common/ItemTile/ItemTile';
import Icon from '../common/Icon/Icon';
import Loader from '../common/Loader/Loader';

import {compose, find, prop, propEq} from 'ramda';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {products} = this.props;
    if (!products || (products && !products.listValid)) {
      this.props.fetchProducts();
    }
  }

  getProducts() {
    const {products} = this.props;
    if (!products || products.loading) return <Loader />;
    if (products.data)
      return products.data.map(product => (
        <ItemTile
          key={product.id}
          link={`/products/${product.id}`}
          sizes="col-4 col-md-2"
          imageUrl={
            product.photos.length
              ? compose(prop('url'), find(propEq('id', product.primaryPhotoId)))(product.photos)
              : null
          }
          price={product.price}
          title={product.title}
        />
      ));
  }

  getServices() {
    return <div className="col-12">......</div>;
  }

  render() {
    return (
      <div className="home">
        <div className="container">
          {!this.props.userData && <TopBanner />}

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
                  <Button size="sm" color="link" className="p-0 mt-4 btn-with-icon d-inline-block">
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
                  <Button size="sm" color="link" className="p-0 mt-4 btn-with-icon d-inline-block">
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
  userData: PropTypes.any,
  userState: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any
  }).isRequired
};

export default Home;
