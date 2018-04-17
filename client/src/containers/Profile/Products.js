import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, withStateHandlers, lifecycle} from 'recompact';

import {fetchProducts} from '../../actions/products';
import {selectOwnProductsFor, selectOwnProductsCount} from '../../selectors';
import ProfileProducts from '../../components/Profile/Products';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';

const DEFAULT_LIMIT = 11;

const refetchProducts = props => {
  const {products} = props;
  if (!products || (!products.listValid && !products.loading)) {
    props.fetchProducts();
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    products: selectOwnProductsFor(state, {skip: ownProps.skip, limit: ownProps.limit}),
    count: selectOwnProductsCount(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchProducts() {
    return dispatch(fetchProducts({scope: 'user', skip: ownProps.skip, limit: ownProps.limit}));
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
    onPaginationPageClick,
    router
  }) => {
    if ((!products || !products.data.length) && !count) return <Loader />;
    return (
      <div className="profile-products">
        <h6 className="profile-products__title">All products</h6>

        <div className="profile-products__pagination">
          <Pagination
            totalPages={Math.ceil(count / limit)}
            currentPage={Math.floor(skip / limit)}
            onNextClick={onPaginationNextClick}
            onPrevClick={onPaginationPrevClick}
            onPageClick={onPaginationPageClick}
          />
        </div>

        <div className="profile-products__content">
          <div className="row">
            {products && products.data && products.data.length ? (
              <ProfileProducts
                products={products.data}
                onEditClick={(e, productId) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/products/edit/${productId}`);
                }}
              />
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    );
  }
);
