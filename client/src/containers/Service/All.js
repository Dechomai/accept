import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router';
import {compose, lifecycle} from 'recompact';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {fetchServices} from '../../actions/services';
import {selectAllServicesFor, selectAllServicesCount} from '../../selectors';
import Pagination from '../../components/common/Pagination/Pagination';
import withPage from '../../components/common/Pagination/withPage';
import withValidPageEnsurance from '../../components/common/Pagination/withValidPageEnsurance';
import Loader from '../../components/common/Loader/Loader';
import ItemsList from '../../components/common/Item/List';
import Empty from '../../components/common/Empty/Empty';

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
  withRouter,
  withPage(DEFAULT_LIMIT),
  connect(mapStateToProps, mapDispatchToProps),
  withValidPageEnsurance(({count}) => count, DEFAULT_LIMIT),
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
)(({services, count, skip, limit}) => {
  const Navigation = ({showResults, showBreadcrumbs}) => (
    <div className="d-flex justify-content-between align-items-center my-3">
      <div>
        {showBreadcrumbs && (
          <Breadcrumb tag="nav">
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span">
              Services
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </div>

      {showResults && <small className="all-services__count">{count} results</small>}

      <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
    </div>
  );

  if (!services || services.loading) return <Loader />;
  if (services && !services.data.length) return <Empty type="product" />;
  return (
    <div className="all-services">
      <Navigation showResults showBreadcrumbs />
      <div className="all-services__content">
        <div className="row">
          {services && services.data && services.data.length ? (
            <ItemsList type="services" list={services.data} tileSize={'col-6 col-sm-3'} />
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <Navigation showResults showBreadcrumbs />
    </div>
  );
});
