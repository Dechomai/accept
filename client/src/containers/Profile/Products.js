import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, withStateHandlers, lifecycle} from 'recompact';
import {fetchProducts, deleteProduct} from '../../actions/products';
import {
  selectOwnProductsFor,
  selectOwnProductsCount,
  selectUserProductsFor,
  selectUserProductsCount
} from '../../selectors';
import ProfileProducts from '../../components/Profile/Products';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';

const DEFAULT_LIMIT = 12;

const refetchProducts = props => {
  const {products} = props;
  if (!products || (!products.listValid && !products.loading)) {
    props.fetchProducts();
  }
};

const mapStateToProps = (state, ownProps) => {
  const {userId} = ownProps.params;

  return {
    editable: !userId,
    products: userId
      ? selectUserProductsFor(state, {userId, skip: ownProps.skip, limit: ownProps.limit})
      : selectOwnProductsFor(state, {skip: ownProps.skip, limit: ownProps.limit}),
    count: userId ? selectUserProductsCount(state, userId) : selectOwnProductsCount(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {userId} = ownProps.params;

  return {
    fetchProducts() {
      return dispatch(
        fetchProducts({scope: userId || 'user', skip: ownProps.skip, limit: ownProps.limit})
      );
    },
    deleteProduct(productId) {
      return dispatch(deleteProduct(productId));
    }
  };
};

export default compose(
  withStateHandlers(
    props => ({
      skip: 0,
      limit: props.params.userId ? DEFAULT_LIMIT : DEFAULT_LIMIT - 1
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
    editable,
    skip,
    limit,
    onPaginationNextClick,
    onPaginationPrevClick,
    onPaginationPageClick,
    router,
    deleteProduct
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
                  router.push(`/products/${productId}/edit`);
                }}
                onDeleteClick={deleteProduct}
                editable={editable}
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
