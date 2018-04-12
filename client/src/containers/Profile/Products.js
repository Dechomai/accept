import React from 'react';
import {compose} from 'ramda';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import autobind from 'autobindr';

import {fetchProducts} from '../../actions/products';
import {selectOwnProductsFor, selectOwnProductsCount} from '../../selectors';
import ProfileProducts from '../../components/Profile/Products';
import Pagination from '../../components/common/Pagination/Pagination';

const DEFAULT_LIMIT = 11;

class ProfileProductsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skip: 0,
      limit: DEFAULT_LIMIT
    };
    autobind(this);
  }

  handlePaginationNextClick() {
    this.setState({skip: this.state.skip + this.state.limit});
  }
  handlePaginationPrevClick() {
    this.setState({skip: this.state.skip - this.state.limit});
  }
  handlePaginationPageClick(pageIndex) {
    this.setState({skip: pageIndex * this.state.limit});
  }

  render() {
    return (
      <ProfileProductsConnected
        skip={this.state.skip}
        limit={this.state.limit}
        onPaginationNextClick={this.handlePaginationNextClick}
        onPaginationPrevClick={this.handlePaginationPrevClick}
        onPaginationPageClick={this.handlePaginationPageClick}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    products: selectOwnProductsFor(state, ownProps.skip, ownProps.limit),
    count: selectOwnProductsCount(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchProducts() {
    return dispatch(fetchProducts('user', ownProps.skip, ownProps.limit));
  }
});

const ProfileProductsConnected = compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(
  class ProfileProductsContainer extends React.Component {
    componentDidMount() {
      this.refetch(this.props);
    }

    //static getDerivedStateFromProps(nextProps, prevState) {
    componentWillUpdate(nextProps) {
      this.refetch(nextProps);
    }

    refetch(props) {
      const {products} = props;
      if (!products || (!products.listValid && !products.loading)) {
        props.fetchProducts();
      }
    }

    render() {
      const {products, count, skip, limit} = this.props;
      if ((!products || !products.data.length) && !count) return <div className="loader" />;
      return (
        <div className="profile-products">
          <h6 className="profile-products__title">All products</h6>

          <div className="profile-products__pagination">
            <Pagination
              totalPages={Math.floor(count / limit)}
              currentPage={Math.floor(skip / limit)}
              onNextClick={this.props.onPaginationNextClick}
              onPrevClick={this.props.onPaginationPrevClick}
              onPageClick={this.props.onPaginationPageClick}
            />
          </div>

          <div className="profile-products__content">
            <div className="row">
              {products && products.data && products.data.length ? (
                <ProfileProducts products={products.data} />
              ) : (
                <div className="loader" />
              )}
            </div>
          </div>
        </div>
      );
    }
  }
);

export default ProfileProductsWrapper;
