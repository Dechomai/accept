import './Step2.scss';

import React from 'react';
import {connect} from 'react-redux';
import {compose, withStateHandlers, lifecycle} from 'recompact';
import {withRouter} from 'react-router';

import {
  selectOwnProductsCount,
  selectOwnServicesCount,
  selectOwnProductsFor,
  selectOwnServicesFor,
  selectExchangeItemType
} from '../../selectors';
import {fetchProducts} from '../../actions/products';
import {fetchServices} from '../../actions/services';
import {getImageThumbnail, getPrimaryImage} from '../../utils/img';
import {formatPrice} from '../../utils/format';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';
import Empty from '../../components/common/Empty/Empty';
import {selectItem} from '../../actions/exchange';
import withDataEnsurance from '../../hoc/exchange/withDataEnsurance';

const DEFAULT_LIMIT = 8;

const refetchItems = props => {
  const {items, type, fetchProducts, fetchServices} = props;
  if (!items || (!items.listValid && !items.loading)) {
    type === 'product' ? fetchProducts() : fetchServices();
  }
};

const mapStateToProps = (state, ownProps) => {
  const type = selectExchangeItemType(state);

  return [('product', 'service')].includes(type)
    ? {
        type,
        items:
          selectExchangeItemType(state) === 'product'
            ? selectOwnProductsFor(state, {skip: ownProps.skip, limit: ownProps.limit})
            : selectOwnServicesFor(state, {skip: ownProps.skip, limit: ownProps.limit}),
        count:
          selectExchangeItemType(state) === 'product'
            ? selectOwnProductsCount(state)
            : selectOwnServicesCount(state)
      }
    : {dataAbsent: true};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onItemSelect(item) {
      return dispatch(selectItem(item));
    },
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
  withDataEnsurance(),
  lifecycle({
    componentDidMount() {
      if (!this.props.dataAbsent) {
        refetchItems(this.props);
      }
    },
    // replace in React v17
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      if (!nextProps.dataAbsent) {
        refetchItems(nextProps);
      }
    }
  })
)(
  ({
    items,
    skip,
    limit,
    count,
    type,
    onItemSelect,
    stepChanged,
    onPaginationNextClick,
    onPaginationPrevClick,
    onPaginationPageClick
  }) => {
    let content = null;
    if (!items || items.loading) {
      content = <Loader />;
    } else if (items && !items.data.length) {
      content = <Empty type={type} />;
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
          <div className="exchange-step2-list">
            {items.data.map(item => {
              const img = getPrimaryImage(item);
              const thumbnail = img ? getImageThumbnail(img) : '/assets/img/placeholder.png';
              return (
                <div
                  className="exchange-step2-list__item"
                  key={item.id}
                  onClick={() => {
                    onItemSelect(item);
                    stepChanged('DETAILS_SPECIFICATION');
                  }}>
                  <div
                    className="exchange-step2-list__item__thumbnail"
                    style={{backgroundImage: `url(${thumbnail})`}}
                  />
                  <div className="exchange-step2-list__item__info">
                    <div className="exchange-step2-list__item__title">{item.title}</div>
                    <div className="exchange-step2-list__item__price">
                      <span className="exchange-step2-list__item__price__value">
                        {formatPrice(item.price)}
                      </span>
                      {type === 'service' && (
                        <span className="exchange-step2-list__item__price__label">per hour</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return <div className="exchange-step2">{content}</div>;
  }
);
