import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, lifecycle} from 'recompact';

import {fetchExchanges} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import {selectExchangesFor, selectProfile} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';
import ExchangesList from '../../components/Exchanges/List';
import Empty from '../../components/Exchanges/Empty';

const DEFAULT_LIMIT = 20;

const refetchExchages = props => {
  const {exchanges} = props;
  if (!exchanges || (!exchanges.listValid && !exchanges.loading)) {
    props.fetchExchanges();
  }
};

const mapStateToProps = (state, ownProps) => ({
  exchanges: selectExchangesFor(state, {
    state: 'pending',
    skip: ownProps.skip,
    limit: ownProps.limit
  }),
  user: selectProfile(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchExchanges() {
    return dispatch(fetchExchanges({state: 'pending', skip: ownProps.skip, limit: ownProps.limit}));
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
)(({exchanges, user}) => {
  if (!exchanges || exchanges.loading) return <Loader />;
  if (exchanges && !exchanges.data.length) return <Empty />;
  if (exchanges && exchanges.data.length)
    return (
      <ExchangesList
        title="Active Exchanges"
        exchanges={exchanges.data}
        showEscrow={true}
        buttons={[
          {
            title: 'Report problem',
            color: 'light',
            onClick() {
              console.log('report contract');
            },
            disabled: true
          },
          {
            title: 'Validate',
            color: 'primary',
            onClick() {
              console.log('validate contract');
            },
            visible: (exchange, user) =>
              (exchange.status === 'validatedByInitiator' &&
                exchange.partner.id === user.data.id) ||
              (exchange.status === 'validatedByPartner' &&
                exchange.initiator.id === user.data.id) ||
              exchange.status === 'accepted',
            disabled: true
          }
        ]}
        user={user}
      />
    );
  return null;
});
