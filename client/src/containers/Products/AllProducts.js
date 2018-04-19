import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router';
import {compose, withStateHandlers, lifecycle} from 'recompact';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {fetchProducts} from '../../actions/products';
import {selectAllProductsFor, selectAllProductsCount} from '../../selectors';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';
import ProductsList from '../../components/Products/ProductsList';

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
  withStateHandlers(
    () => ({
      skip: 0,
      limit: DEFAULT_LIMIT
    }),
    {
      onPaginationNextClick: ({skip, limit}) => () => ({
        skip: skip + limit
      }),
      onPaginationPrevClick: ({skip, limit}) => () => ({
        skip: skip - limit
      }),
      onPaginationPageClick: ({limit}) => pageIndex => ({
        skip: pageIndex * limit
      })
    }
  ),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
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
)(
  ({
    products,
    count,
    skip,
    limit,
    onPaginationNextClick,
    onPaginationPrevClick,
    onPaginationPageClick
  }) => {
    if ((!products || !products.data.length) && !count) return <Loader />;
    return (
      <div className="all-products">
        <div className="d-flex justify-content-between align-items-center my-3">
          <Breadcrumb tag="nav">
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span">
              Products
            </BreadcrumbItem>
          </Breadcrumb>

          <small className="all-products__count">{count} results</small>

          <Pagination
            totalPages={Math.ceil(count / limit)}
            currentPage={Math.floor(skip / limit)}
            onNextClick={onPaginationNextClick}
            onPrevClick={onPaginationPrevClick}
            onPageClick={onPaginationPageClick}
          />
        </div>

        <div className="all-products__content">
          <div className="row">
            {products && products.data && products.data.length ? (
              <ProductsList list={products.data} tileSize={'col-6 col-sm-3'} />
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    );
  }
);
