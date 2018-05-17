import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router';
import {compose, lifecycle} from 'recompact';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {fetchProducts} from '../../actions/products';
import {selectAllProductsFor, selectAllProductsCount} from '../../selectors';
import Pagination from '../../components/common/Pagination/Pagination';
import withPage from '../../hoc/pagination/withPage';
import withValidPageEnsurance from '../../hoc/pagination/withValidPageEnsurance';
import Loader from '../../components/common/Loader/Loader';
import ItemsList from '../../components/common/Item/List';
import Empty from '../../components/common/Empty/Empty';

const DEFAULT_LIMIT = 20;

const refetchProducts = props => {
  const {products} = props;
  if (!products || (!products.listValid && !products.loading)) {
    props.fetchProducts();
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    products: selectAllProductsFor(state, {skip: ownProps.skip, limit: ownProps.limit}),
    count: selectAllProductsCount(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchProducts() {
    return dispatch(fetchProducts({scope: 'all', skip: ownProps.skip, limit: ownProps.limit}));
  }
});

export default compose(
  withRouter,
  withPage(DEFAULT_LIMIT),
  connect(mapStateToProps, mapDispatchToProps),
  withValidPageEnsurance(({count}) => count, DEFAULT_LIMIT),
  lifecycle({
    componentDidMount() {
      refetchProducts(this.props);
    },
    // replace in React v17
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      refetchProducts(nextProps);
    }
  })
)(({products, count, skip, limit}) => {
  const Navigation = ({showResults, showBreadcrumbs}) => (
    <div className="d-flex justify-content-between align-items-center my-3">
      <div>
        {showBreadcrumbs && (
          <Breadcrumb tag="nav">
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span">
              Products
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </div>

      {showResults && <small className="all-products__count">{count} results</small>}

      <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
    </div>
  );

  if (!products || products.loading) return <Loader />;
  if (products && !products.data.length) return <Empty type="product" />;
  return (
    <div className="all-products">
      <Navigation showResults showBreadcrumbs />
      <div className="all-products__content">
        <div className="row">
          {products && products.data && products.data.length ? (
            <ItemsList type="products" list={products.data} tileSize="col-6 col-sm-3" />
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <Navigation showResults showBreadcrumbs />
    </div>
  );
});
