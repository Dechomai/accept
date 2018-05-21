import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, lifecycle} from 'recompact';

import {fetchExchanges} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import {selectExchangesFor, selectProfile} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';
import ExchangesList from '../../components/Exchanges/List';

const DEFAULT_LIMIT = 20;

const refetchProducts = props => {
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
  user: selectProfile(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchExchanges() {
    return dispatch(
      fetchExchanges({state: 'outcoming', skip: ownProps.skip, limit: ownProps.limit})
    );
  }
});

export default compose(
  withRouter,
  withPage(DEFAULT_LIMIT),
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      refetchProducts(this.props);
    },
    // replace in React v17
    // static getDerivedStateFromProps(nextProps, prevState)
    componentWillUpdate(nextProps) {
      refetchProducts(nextProps);
    }
  })
)(({exchanges, user}) => {
  if (!exchanges || exchanges.loading) return <Loader />;
  if (exchanges && !exchanges.data.length) return <h6>There are no exchanges yet</h6>;
  if (exchanges && exchanges.data.length)
    return (
      <ExchangesList
        type="outcoming"
        title="Outcoming Offers"
        exchanges={exchanges.data}
        showEscrow={false}
        buttons={[
          {
            title: 'Cancel',
            color: 'light',
            onClick() {
              console.log('cancel contract');
            },
            disabled: true
          }
        ]}
        user={user}
      />
    );
  return null;
});
