import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose, path} from 'ramda';
import autobind from 'autobindr';

import {selectServiceById, selectProfile, selectExchangeStep} from '../../selectors';
import {fetchServiceById} from '../../actions/services';
import {startNewExchange, cancelExchange} from '../../actions/exchange';
import ServiceDetails from '../../components/Service/Details';
import Loader from '../../components/common/Loader/Loader';
import Exchange from '../Exchange/Exchange';

class Details extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const {params, service} = this.props;
    if (!service && params.serviceId) {
      this.props.fetchServiceById(params.serviceId);
    }
  }

  handleExchangeClick() {
    this.props.startNewExchange();
  }

  handleExchangeCancel() {
    this.props.cancelExchange();
  }

  render() {
    const {service, user} = this.props;
    const userId = path(['data', 'id'], user);
    if (path(['data'], service)) {
      return (
        <React.Fragment>
          {this.props.exchangeStep >= 0 && (
            <Exchange
              type="service"
              itemId={service.data.id}
              onCancel={this.handleExchangeCancel}
            />
          )}
          <ServiceDetails
            isSignedIn={!!user.data}
            service={service.data}
            isOwner={service.data.createdBy.id === userId}
            onExchangeClick={this.handleExchangeClick}
          />
        </React.Fragment>
      );
    } else if (path(['loading'], service)) {
      return <Loader />;
    } else {
      return <div className="alert alert-danger">There is no service with specified ID</div>;
    }
  }
}

Details.propTypes = {
  service: PropTypes.any,
  user: PropTypes.any,
  exchangeStep: PropTypes.number
};

const mapStateToProps = (state, ownProps) => ({
  user: selectProfile(state),
  service: selectServiceById(state, ownProps.params.serviceId),
  exchangeStep: selectExchangeStep(state)
});

const mapDispatchToProps = dispatch => ({
  fetchServiceById(serviceId) {
    return dispatch(fetchServiceById(serviceId));
  },
  startNewExchange() {
    return dispatch(startNewExchange());
  },
  cancelExchange() {
    return dispatch(cancelExchange());
  }
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Details);
