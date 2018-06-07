import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose} from 'recompact';
import autobind from 'autobindr';

import {fetchExchanges, reportExchange, validateExchange} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import withValidPageEnsurance from '../../hoc/pagination/withValidPageEnsurance';
import {selectExchangesFor, selectExchangesCountFor, selectProfile} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';
import ExchangesList from '../../components/Exchanges/List';
import Empty from '../../components/Exchanges/Empty';
import ExchangesModal from '../../components/Exchanges/Modal';
import Confirmation from '../../components/Exchange/Confirmation';
import ConnectionCheckModal from '../../components/Exchange/ConnectionCheckModal';

const DEFAULT_LIMIT = 10;

const shouldShowActionBtn = (exchange, user) => {
  const {status} = exchange;
  const isPartner = exchange.partner.id === user.data.id;
  const isInitiator = exchange.initiator.id === user.data.id;
  if (isPartner && status !== 'validatedByPartner') return true;
  if (isInitiator && status !== 'validatedByInitiator') return true;
};

class PendingExchanges extends React.Component {
  constructor() {
    super();
    this.state = {
      showConnectionCheck: false,
      showPendingTransaction: false
    };
    autobind(this);
  }

  componentDidMount() {
    refetchExchages(this.props, true);
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
    const method = action === 'report' ? 'reportExchange' : 'validateExchange';
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

  handleExchangeReportBtnClick(exchange) {
    this.setState({
      showConnectionCheck: true,
      activeEchange: exchange,
      action: 'report'
    });
  }

  handleExchangeValidateBtnClick(exchange) {
    this.setState({
      showConnectionCheck: true,
      activeEchange: exchange,
      action: 'validate'
    });
  }

  render() {
    const {exchanges, user, count, skip, limit} = this.props;

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
            title="Active Exchanges"
            exchanges={exchanges.data}
            showEscrow={true}
            buttons={[
              {
                title: 'Report',
                color: 'light',
                onClick: this.handleExchangeReportBtnClick,
                visible: shouldShowActionBtn
              },
              {
                title: 'Validate',
                color: 'primary',
                onClick: this.handleExchangeValidateBtnClick,
                visible: shouldShowActionBtn
              }
            ]}
            user={user}
            count={count}
            skip={skip}
            limit={limit}
          />
        </React.Fragment>
      );
    return null;
  }
}

PendingExchanges.propTypes = {
  exchanges: PropTypes.any,
  user: PropTypes.object.isRequired,
  validateExchange: PropTypes.func.isRequired,
  reportExchange: PropTypes.func.isRequired
};

const refetchExchages = ({exchanges, fetchExchanges}, forceFetch = false) => {
  if (forceFetch && exchanges && !exchanges.loading) return fetchExchanges();
  if (!exchanges || (!exchanges.listValid && !exchanges.loading)) return fetchExchanges();
};

const mapStateToProps = (state, ownProps) => ({
  exchanges: selectExchangesFor(state, {
    state: 'pending',
    skip: ownProps.skip,
    limit: ownProps.limit
  }),
  count: selectExchangesCountFor(state, 'pending'),
  user: selectProfile(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchExchanges() {
    return dispatch(fetchExchanges({state: 'pending', skip: ownProps.skip, limit: ownProps.limit}));
  },

  validateExchange({exchange, user}) {
    return dispatch(validateExchange({exchange, user}));
  },

  reportExchange({exchange, user}) {
    return dispatch(reportExchange({exchange, user}));
  }
});

export default compose(
  withRouter,
  withPage(DEFAULT_LIMIT),
  connect(mapStateToProps, mapDispatchToProps),
  withValidPageEnsurance(({count}) => count, DEFAULT_LIMIT)
)(PendingExchanges);
