import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, lifecycle} from 'recompact';
import {fetchServices, deleteService} from '../../actions/services';
import {
  selectOwnServicesFor,
  selectOwnServicesCount,
  selectUserServicesFor,
  selectUserServicesCount
} from '../../selectors';
import Pagination from '../../components/common/Pagination/Pagination';
import withPage from '../../hoc/pagination/withPage';
import withValidPageEnsurance from '../../hoc/pagination/withValidPageEnsurance';
import Loader from '../../components/common/Loader/Loader';
import ProfileServices from '../../components/Profile/Services';
import Empty from '../../components/common/Empty/Empty';

const DEFAULT_LIMIT = 12;

const refetchServices = props => {
  const {services} = props;
  if (!services || (!services.listValid && !services.loading)) {
    props.fetchServices();
  }
};

const mapStateToProps = (state, ownProps) => {
  const {userId} = ownProps.params;

  return {
    editable: !userId,
    services: userId
      ? selectUserServicesFor(state, {userId, skip: ownProps.skip, limit: ownProps.limit})
      : selectOwnServicesFor(state, {skip: ownProps.skip, limit: ownProps.limit}),
    count: userId ? selectUserServicesCount(state, userId) : selectOwnServicesCount(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {userId} = ownProps.params;

  return {
    fetchServices() {
      return dispatch(
        fetchServices({scope: userId || 'user', skip: ownProps.skip, limit: ownProps.limit})
      );
    },
    deleteService(serviceId) {
      return dispatch(deleteService(serviceId));
    }
  };
};

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
)(({services, count, editable, skip, limit, router, deleteService}) => {
  if (!services || services.loading) return <Loader />;
  if (services && !services.data.length) {
    return (
      <div className="profile-services">
        <div className="profile-services__content">
          <Empty type="service" />
        </div>
      </div>
    );
  }
  return (
    <div className="profile-services">
      <h6 className="profile-services__title">All services</h6>

      <div className="profile-services__pagination">
        <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
      </div>

      <div className="profile-services__content">
        <div className="row">
          {services && services.data && services.data.length ? (
            <ProfileServices
              services={services.data}
              onEditClick={(e, serviceId) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/services/${serviceId}/edit`);
              }}
              onDeleteClick={deleteService}
              editable={editable}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <div className="profile-services__pagination">
        <Pagination totalPages={Math.ceil(count / limit)} currentPage={Math.floor(skip / limit)} />
      </div>
    </div>
  );
});
