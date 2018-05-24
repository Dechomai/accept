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
        type="incoming"
        title="Incoming Offers"
        exchanges={exchanges.data}
        showEscrow={true}
        buttons={[
          {
            title: 'Reject',
            color: 'light',
            onClick() {
              console.log('reject contract');
            },
            disabled: true
          },
          {
            title: 'Accept',
            color: 'primary',
            onClick() {
              console.log('accept contract');
            },
            disabled: true
          }
        ]}
        user={user}
      />
    );
  return null;
});
