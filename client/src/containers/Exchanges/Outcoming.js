import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, lifecycle} from 'recompact';

import {fetchExchanges, cancelExchange} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import {selectExchangeCancellation, selectExchangesFor, selectProfile} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';
import ExchangesList from '../../components/Exchanges/List';
import ExchangesModal from '../../components/Exchanges/Modal';
import Confirmation from '../../components/Exchange/Confirmation';

const DEFAULT_LIMIT = 20;

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
  exchangeCancellation: selectExchangeCancellation(state),
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
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      refetchExchages(this.props);
    },
    // replace in React v17
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      refetchExchages(nextProps);
    }
  })
)(({exchanges, user, cancelExchange, exchangeCancellation}) => {
  if (!exchanges || exchanges.loading) return <Loader />;
  if (exchanges && !exchanges.data.length) return <h6>There are no exchanges yet</h6>;
  if (exchanges && exchanges.data.length)
    return (
      <React.Fragment>
        {exchangeCancellation &&
          exchangeCancellation.loading && (
            <ExchangesModal>
              <Confirmation state="cancelling" />
            </ExchangesModal>
          )}
        <ExchangesList
          type="outcoming"
          title="Outcoming Offers"
          exchanges={exchanges.data}
          showEscrow={false}
          buttons={[
            {
              title: 'Cancel',
              color: 'light',
              onClick(exchange) {
                cancelExchange({exchange, user: user.data});
              }
            }
          ]}
          user={user}
        />
      </React.Fragment>
    );
  return null;
});
