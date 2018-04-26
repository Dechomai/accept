import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router';
import {compose, withStateHandlers, lifecycle} from 'recompact';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {fetchServices} from '../../actions/products';
import {selectAllServicesFor, selectAllServicesCount} from '../../selectors';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';
import ItemsList from '../../components/common/Item/List';

const DEFAULT_LIMIT = 20;

const refetchServices = props => {
  const {services} = props;
  if (!services || (!services.listValid && !services.loading)) {
    props.fetchServices();
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    services: selectAllServicesFor(state, {skip: ownProps.skip, limit: ownProps.limit}),
    count: selectAllServicesCount(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchServices() {
    return dispatch(fetchServices({scope: 'all', skip: ownProps.skip, limit: ownProps.limit}));
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
      refetchServices(this.props);
    },
    // replace in React v17
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      refetchServices(nextProps);
    }
  })
)(
  ({
    services,
    count,
    skip,
    limit,
    onPaginationNextClick,
    onPaginationPrevClick,
    onPaginationPageClick
  }) => {
    const Navigation = ({showResults}) => (
      <div className="d-flex justify-content-between align-items-center my-3">
        <Breadcrumb tag="nav">
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active tag="span">
            Services
          </BreadcrumbItem>
        </Breadcrumb>

        {showResults && <small className="all-services__count">{count} results</small>}

        <Pagination
          totalPages={Math.ceil(count / limit)}
          currentPage={Math.floor(skip / limit)}
          onNextClick={onPaginationNextClick}
          onPrevClick={onPaginationPrevClick}
          onPageClick={onPaginationPageClick}
        />
      </div>
    );

    if ((!services || !services.data.length) && !count) return <Loader />;
    return (
      <div className="all-services">
        <Navigation showResults />
        <div className="all-services__content">
          <div className="row">
            {services && services.data && services.data.length ? (
              <ItemsList list={services.data} tileSize={'col-6 col-sm-3'} />
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <Navigation />
      </div>
    );
  }
);
