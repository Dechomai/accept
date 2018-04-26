import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, path} from 'ramda';

import {selectServiceById, selectProfile} from '../../selectors';
import {fetchServiceById} from '../../actions/services';
import ServiceDetails from '../../components/Service/Details';
import Loader from '../../components/common/Loader/Loader';

class Details extends React.Component {
  componentDidMount() {
    const {params, service} = this.props;
    if (!service && params.serviceId) {
      this.props.fetchServiceById(params.serviceId);
    }
  }

  render() {
    const {service, user} = this.props;
    const userId = path(['data', 'id'], user);
    return service && service.data ? (
      <ServiceDetails service={service.data} isOwner={service.data.createdBy.id === userId} />
    ) : (
      <Loader />
    );
  }
}

Details.propTypes = {
  service: PropTypes.any,
  user: PropTypes.any
};

const mapStateToProps = (state, ownProps) => ({
  user: selectProfile(state),
  service: selectServiceById(state, ownProps.params.serviceId)
});

const mapDispatchToProps = dispatch => ({
  fetchServiceById(serviceId) {
    return dispatch(fetchServiceById(serviceId));
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Details);
