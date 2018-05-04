import './Step2.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, withStateHandlers, lifecycle} from 'recompact';
import {fetchProducts} from '../../actions/products';
import {fetchServices} from '../../actions/services';
import {withRouter} from 'react-router';

import {
  selectOwnProductsCount,
  selectOwnServicesCount,
  selectOwnProductsFor,
  selectOwnServicesFor
} from '../../selectors';

import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';
import Empty from '../../components/common/Empty/Empty';

const DEFAULT_LIMIT = 2;

const refetchItems = props => {
  const {items} = props;
  if (!items || (!items.listValid && !items.loading)) {
    props.itemType === 'product' ? props.fetchProducts() : props.fetchServices();
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    items:
      ownProps.itemType === 'product'
        ? selectOwnProductsFor(state, {skip: ownProps.skip, limit: ownProps.limit})
        : selectOwnServicesFor(state, {skip: ownProps.skip, limit: ownProps.limit}),
    count:
      ownProps.itemType === 'product'
        ? selectOwnProductsCount(state)
        : selectOwnServicesCount(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchProducts() {
      return dispatch(fetchProducts({scope: 'user', skip: ownProps.skip, limit: ownProps.limit}));
    },
    fetchServices() {
      return dispatch(fetchServices({scope: 'user', skip: ownProps.skip, limit: ownProps.limit}));
    }
  };
};

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
      refetchItems(this.props);
    },
    // replace in React v17
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      refetchItems(nextProps);
    }
  })
)(
  ({
    items,
    skip,
    limit,
    count,
    itemType,
    onPaginationNextClick,
    onPaginationPrevClick,
    onPaginationPageClick
  }) => {
    let content = null;
    if (!items || items.loading) {
      content = <Loader />;
    } else if (items && !items.data.length) {
      content = <Empty type={itemType} />;
    } else {
      content = (
        <div className="exchange-step2__items">
          <Pagination
            totalPages={Math.ceil(count / limit)}
            currentPage={Math.floor(skip / limit)}
            onNextClick={onPaginationNextClick}
            onPrevClick={onPaginationPrevClick}
            onPageClick={onPaginationPageClick}
          />
          {items.data.map(item => <div key={item.id}>{item.title}</div>)}
        </div>
      );
    }

    return <div className="exchange-step2">{content}</div>;
  }
);
