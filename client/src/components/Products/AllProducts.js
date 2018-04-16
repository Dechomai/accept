import './AllProducts.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import ItemTile from '../common/ItemTile/ItemTile';
import Loader from '../common/Loader/Loader';

const TILE_SIZE = 'col-6 col-sm-3';

class AllProducts extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {products} = this.props;
    if (!products || (products && !products.listValid)) {
      this.props.fetchProducts();
    }
  }

  renderProductsList() {
    const {products} = this.props;
    if (!products || products.loading) return <Loader />;

    if (products.data) {
      return products.data.map(product => (
        <ItemTile
          key={product.id}
          link={`/products/${product.id}`}
          sizes={TILE_SIZE}
          editable={true}
          photo={product.photos.length ? product.photos.find(p => p.primary).uri : null}
          price={product.price}
          title={product.title}
        />
      ));
    }
  }

  render() {
    return (
      <div>
        <div className="all-products__top-line">
          <Breadcrumb tag="nav">
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span">
              Products
            </BreadcrumbItem>
          </Breadcrumb>
          {this.props.count && (
            <small className="all-products__count">{this.props.count} results</small>
          )}
        </div>
        <div className="row">{this.renderProductsList()}</div>
      </div>
    );
  }
}

AllProducts.propTypes = {
  products: PropTypes.any
};

export default AllProducts;
