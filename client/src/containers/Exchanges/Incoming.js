import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose} from 'recompact';
import autobind from 'autobindr';

import {fetchExchanges} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import {selectExchangesFor, selectProfile} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';
import ExchangesList from '../../components/Exchanges/List';
import Empty from '../../components/Exchanges/Empty';
import ExchangesModal from '../../components/Exchanges/Modal';
import Confirmation from '../../components/Exchange/Confirmation';
import ConnectionCheckModal from '../../components/Exchange/ConnectionCheckModal';

const DEFAULT_LIMIT = 20;

class IncomingExchanges extends React.Component {
  constructor() {
    super();
    this.state = {
      showConnectionCheck: false,
      showPendingTransaction: false
    };
    autobind(this);
  }

  componentDidMount() {
    refetchExchages(this.props);
  }
  // replace in React v17
  // static getDerivedStateFromProps(nextProps, prevState)
  componentWillUpdate(nextProps) {
    refetchExchages(nextProps);
  }

  handleConnectionCheckSuccess() {
    const {action, activeEchange} = this.state;
    this.setState({
      showConnectionCheck: false,
      activeEchange: null,
      showPendingTransaction: true
    });
    const method = action === 'reject' ? 'rejectExchange' : 'acceptExchange';
    this.props[method]({exchange: activeEchange, user: this.props.user.data}).then(() => {
      this.setState({showPendingTransaction: false});
    });
  }

  handleConnectionCheckCancel() {
    this.setState({
      showConnectionCheck: false,
      activeEchange: null,
      action: null
    });
  }

  handleExchangeRejectBtnClick(exchange) {
    this.setState({
      showConnectionCheck: true,
      activeEchange: exchange,
      action: 'reject'
    });
  }

  handleExchangeAcceptBtnClick(exchange) {
    this.setState({
      showConnectionCheck: true,
      activeEchange: exchange,
      action: 'accept'
    });
  }

  render() {
    const {exchanges, user} = this.props;

    if (!exchanges || exchanges.loading) return <Loader />;
    if (exchanges && !exchanges.data.length) return <Empty />;
    if (exchanges && exchanges.data.length)
      return (
        <React.Fragment>
          {this.state.showPendingTransaction && (
            <ExchangesModal>
              <Confirmation state="waiting" />
            </ExchangesModal>
          )}
          {this.state.showConnectionCheck && (
            <ConnectionCheckModal
              address={user.data.bcDefaultAccountAddress}
              onSuccess={this.handleConnectionCheckSuccess}
              onCancelBtnClick={this.handleConnectionCheckCancel}
            />
          )}
          <ExchangesList
            title="Incoming Offers"
            exchanges={exchanges.data}
            showEscrow={true}
            buttons={[
              {
                title: 'Reject',
                color: 'light',
                onClick: this.handleExchangeRejectBtnClick
              },
              {
                title: 'Accept',
                color: 'primary',
                onClick: this.handleExchangeAcceptBtnClick
              }
            ]}
            user={user}
          />
        </React.Fragment>
      );
    return null;
  }
}

IncomingExchanges.propTypes = {
  exchanges: PropTypes.any,
  user: PropTypes.object.isRequired,
  acceptExchange: PropTypes.func.isRequired,
  rejectExchange: PropTypes.func.isRequired
};

const refetchExchages = props => {
  const {exchanges} = props;
  if (!exchanges || (!exchanges.listValid && !exchanges.loading)) {
    props.fetchExchanges();
  }
};

const mapStateToProps = (state, ownProps) => ({
  exchanges: selectExchangesFor(state, {
    state: 'incoming',
    skip: ownProps.skip,
    limit: ownProps.limit
  }),
  user: selectProfile(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchExchanges() {
    return dispatch(
      fetchExchanges({state: 'incoming', skip: ownProps.skip, limit: ownProps.limit})
    );
  },
  acceptExchange() {
    return Promise.resolve();
  },
  rejectExchange() {
    return Promise.resolve();
  }
});

export default compose(
  withRouter,
  withPage(DEFAULT_LIMIT),
  connect(mapStateToProps, mapDispatchToProps)
)(IncomingExchanges);
