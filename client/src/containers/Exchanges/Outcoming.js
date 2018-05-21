import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {compose, lifecycle} from 'recompact';

import {fetchExchanges} from '../../actions/exchanges';
import withPage from '../../hoc/pagination/withPage';
import {selectExchangesFor} from '../../selectors';
import Loader from '../../components/common/Loader/Loader';

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
  })
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
)(({exchanges}) => {
  if (!exchanges || exchanges.loading) return <Loader />;
  if (exchanges && !exchanges.data.length) return <h6>There are no exchanges yet</h6>;
  if (exchanges && exchanges.data.length)
    return exchanges.data.map(exchange => (
      <div key={exchange.id}>
        <pre>{JSON.stringify(exchange, null, 2)}</pre>
      </div>
    ));
  return null;
});
