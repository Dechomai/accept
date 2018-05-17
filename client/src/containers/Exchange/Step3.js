import './Step3.scss';

import React from 'react';
import ExchangeItem from '../../components/Exchange/ExchangeItem';
import ExchangeEscrow from '../../components/Exchange/Escrow';
import {connect} from 'react-redux';
import {fetchServiceById} from '../../actions/services';
import {fetchProductById} from '../../actions/products';
import {selectProductById, selectServiceById} from '../../selectors';
import {changeOwnCount, changeOwnDays, changeOwnTime} from '../../actions/exchange';
import PropTypes from 'prop-types';

class ExchangeStep3 extends React.Component {
  constructor(props) {
    super(props);
  }

  refetchItem() {
    const {item, fetchItem} = this.props;

    if (!item || (item.error && !item.loading)) {
      fetchItem();
    }
  }

  componentDidMount() {
    this.refetchItem(this.props);
  }

  componentWillUpdate(nextProps) {
    this.refetchItem(nextProps);
  }

  render() {
    return (
      <div className="exchange-step3">
        {this.props.item &&
          this.props.item.data && (
            <div>
              <ExchangeItem title="Your offer" own {...this.props} item={this.props.item} />
              <ExchangeEscrow
                difference={this.props.calculateEscrowDifference()}
                escrow={this.props.calculateEscrow()}
              />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    item:
      ownProps.type === 'product'
        ? selectProductById(state, ownProps.itemId)
        : selectServiceById(state, ownProps.itemId)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchItem() {
    return dispatch(
      ownProps.type === 'product'
        ? fetchProductById(ownProps.itemId)
        : fetchServiceById(ownProps.itemId)
    );
  },
  onQuantityChange(count) {
    return dispatch(changeOwnCount(count));
  },
  onDaysChange(days) {
    return dispatch(changeOwnDays(days));
  },
  onTimeChange(time) {
    return dispatch(changeOwnTime(time));
  }
});

ExchangeStep3.propTypes = {
  type: PropTypes.string,
  item: PropTypes.any,
  itemId: PropTypes.string,
  quantity: PropTypes.number,
  partnerCount: PropTypes.number,
  days: PropTypes.any,
  time: PropTypes.any,
  partnerItem: PropTypes.object,
  calculateEscrowDifference: PropTypes.func,
  calculateEscrow: PropTypes.func,
  fetchItem: PropTypes.func,
  onQuantityChange: PropTypes.func,
  onDaysChange: PropTypes.func,
  onTimeChange: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeStep3);
