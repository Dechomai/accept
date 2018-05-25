import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose} from 'recompact';
import autobind from 'autobindr';

import {fetchExchanges, cancelExchange} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import {selectExchangeProcessing, selectExchangesFor, selectProfile} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';
import ExchangesList from '../../components/Exchanges/List';
import ExchangesModal from '../../components/Exchanges/Modal';
import Confirmation from '../../components/Exchange/Confirmation';
import Empty from '../../components/Exchanges/Empty';
import ConnectionCheckModal from '../../components/Exchange/ConnectionCheckModal';

const DEFAULT_LIMIT = 20;

class OutcomingExchanges extends React.Component {
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
    const {activeEchange} = this.state;
    this.setState({
      showConnectionCheck: false,
      activeEchange: null,
      showPendingTransaction: true
    });
    this.props.cancelExchange({exchange: activeEchange, user: this.props.user.data}).then(() => {
      this.setState({showPendingTransaction: false});
    });
  }

  handleConnectionCheckCancel() {
    this.setState({showConnectionCheck: false, activeEchange: null});
  }

  handleExchangeCancelBtnClick(exchange) {
    this.setState({showConnectionCheck: true, activeEchange: exchange});
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
            title="Outcoming Offers"
            exchanges={exchanges.data}
            showEscrow={false}
            buttons={[
              {
                title: 'Cancel',
                color: 'light',
                onClick: this.handleExchangeCancelBtnClick
              }
            ]}
            user={user}
          />
        </React.Fragment>
      );
    return null;
  }
}

OutcomingExchanges.propTypes = {
  exchanges: PropTypes.any,
  user: PropTypes.object.isRequired,
  cancelExchange: PropTypes.func.isRequired
};

const refetchExchages = props => {
  const {exchanges} = props;
  if (!exchanges || (!exchanges.listValid && !exchanges.loading)) {
    props.fetchExchanges();
  }
};

const mapStateToProps = (state, ownProps) => ({
  exchanges: selectExchangesFor(state, {
    state: 'outcoming',
    skip: ownProps.skip,
    limit: ownProps.limit
  }),
  exchangeProcessing: selectExchangeProcessing(state),
  user: selectProfile(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchExchanges() {
    return dispatch(
      fetchExchanges({state: 'outcoming', skip: ownProps.skip, limit: ownProps.limit})
    );
  },
  cancelExchange(...args) {
    return dispatch(cancelExchange(...args));
  }
});

export default compose(
  withRouter,
  withPage(DEFAULT_LIMIT),
  connect(mapStateToProps, mapDispatchToProps)
)(OutcomingExchanges);
