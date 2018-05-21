import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose, path} from 'ramda';
import autobind from 'autobindr';

import {selectServiceById, selectProfile} from '../../selectors';
import {fetchServiceById} from '../../actions/services';
import {startNewExchange} from '../../actions/exchange';
import ServiceDetails from '../../components/Service/Details';
import Loader from '../../components/common/Loader/Loader';
import Exchange from '../Exchange/Exchange';
import exchangeCache from '../../services/exchangeCache';

class Details extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showExchange: false
    };
  }

  componentDidMount() {
    const {params, service, router} = this.props;
    if (!service && params.serviceId) {
      this.props.fetchServiceById(params.serviceId);
    }

    if (router.location.query.step) {
      this.setState({
        showExchange: true
      });
    }
  }

  handleExchangeClick() {
    exchangeCache.reset();
    this.props.startNewExchange();
    this.setState({
      showExchange: true
    });
  }

  handleExchangeCancel() {
    const {router} = this.props;

    this.setState({
      showExchange: false
    });

    router.push({
      pathname: router.location.pathname,
      query: {}
    });
  }

  render() {
    const {service, user} = this.props;
    const userId = path(['data', 'id'], user);
    if (path(['data'], service)) {
      return (
        <React.Fragment>
          {this.state.showExchange && (
            <Exchange
              type="service"
              itemId={service.data.id}
              onCancel={this.handleExchangeCancel}
            />
          )}
          <ServiceDetails
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
  user: PropTypes.any
};

const mapStateToProps = (state, ownProps) => ({
  user: selectProfile(state),
  service: selectServiceById(state, ownProps.params.serviceId)
});

const mapDispatchToProps = dispatch => ({
  fetchServiceById(serviceId) {
    return dispatch(fetchServiceById(serviceId));
  },
  startNewExchange() {
    return dispatch(startNewExchange());
  }
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Details);
