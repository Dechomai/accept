import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, lifecycle, withHandlers} from 'recompact';

import {fetchExchanges} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import withValidPageEnsurance from '../../hoc/pagination/withValidPageEnsurance';
import {selectExchangesFor, selectExchangesCountFor, selectProfile} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';
import ExchangesList from '../../components/Exchanges/List';

const DEFAULT_LIMIT = 10;

const refetchExchages = ({exchanges, fetchExchanges}, forceFetch = false) => {
  if (forceFetch && exchanges && !exchanges.loading) return fetchExchanges();
  if (!exchanges || (!exchanges.listValid && !exchanges.loading)) return fetchExchanges();
};

const mapStateToProps = (state, ownProps) => ({
  exchanges: selectExchangesFor(state, {
    state: 'reported',
    skip: ownProps.skip,
    limit: ownProps.limit
  }),
  count: selectExchangesCountFor(state, 'reported'),
  user: selectProfile(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchExchanges() {
    return dispatch(
      fetchExchanges({state: 'reported', skip: ownProps.skip, limit: ownProps.limit})
    );
  }
});

export default compose(
  withRouter,
  withPage(DEFAULT_LIMIT),
  connect(mapStateToProps, mapDispatchToProps),
  withValidPageEnsurance(({count}) => count, DEFAULT_LIMIT),
  lifecycle({
    componentDidMount() {
      refetchExchages(this.props, true);
    },
    // replace in React v17
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      refetchExchages(nextProps);
    }
  }),
  withHandlers({
    handleRefreshBtnCLick: props => () => {
      refetchExchages(props, true);
    }
  })
)(({exchanges, user, count, skip, limit, handleRefreshBtnCLick}) => {
  if (!exchanges || exchanges.loading) return <Loader />;
  if (exchanges && exchanges.data)
    return (
      <ExchangesList
        title="Offers with Issues"
        exchanges={exchanges.data}
        onRefreshBtnClick={handleRefreshBtnCLick}
        showEscrow={false}
        user={user}
        count={count}
        skip={skip}
        limit={limit}
      />
    );
  return null;
});
