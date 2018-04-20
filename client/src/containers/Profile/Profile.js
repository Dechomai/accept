import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {selectOwnProductsCount, selectUserProductsCount} from '../../selectors';
import Profile from '../../components/Profile/Profile';

const mapStateToProps = (state, ownProps) => {
  const {userId, children} = ownProps;

  if (!userId) {
    return {
      children,
      isCurrentUser: true,
      productsCount: selectOwnProductsCount(state)
    };
  }

  return {
    children,
    isCurrentUser: false,
    productsCount: selectUserProductsCount(state, userId)
  };
};

const mapDispatchToProps = () => {};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Profile);
