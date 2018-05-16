import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, withProps, lifecycle} from 'recompact';
import {fetchProducts, deleteProduct} from '../../actions/products';
import {
  selectOwnProductsFor,
  selectOwnProductsCount,
  selectUserProductsFor,
  selectUserProductsCount
} from '../../selectors';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';
import ProfileProducts from '../../components/Profile/Products';
import Empty from '../../components/common/Empty/Empty';

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
  withRouter,
  withProps(({location}) => ({
    skip: (parseInt(location.query.page) - 1 || 0) * DEFAULT_LIMIT,
    limit: DEFAULT_LIMIT
  })),
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
)(({products, count, editable, skip, limit, router, deleteProduct}) => {
  if (!products || products.loading) return <Loader />;
  if (products && !products.data.length) {
    return (
      <div className="profile-products">
        <div className="profile-products__content">
          <Empty type="product" />
        </div>
      </div>
    );
  }
  return (
    <div className="profile-products">
      <h6 className="profile-products__title">All products</h6>

      <div className="profile-products__pagination">
        <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
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
      <div className="profile-products__pagination">
        <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
      </div>
    </div>
  );
});
