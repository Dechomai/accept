import {connect} from 'react-redux';
import {compose, lifecycle, branch, renderNothing} from 'recompact';
import {
  selectExchangeItemType,
  selectExchangeItemId,
  selectExchangeOwnCount,
  selectExchangeOwnDays,
  selectExchangeOwnTime,
  selectExchangePartnerCount,
  selectExchangePartnerDays,
  selectExchangePartnerTime
} from '../../selectors';
import {all} from 'ramda';

export default requiredProps => {
  const isDataAbsent = props => !all(prop => props[prop])(requiredProps);

  return compose(
    connect(state => ({
      initiatorItemType: selectExchangeItemType(state),
      initiatorItemId: selectExchangeItemId(state),
      initiatorItemCount: selectExchangeOwnCount(state),
      initiatorItemDays: selectExchangeOwnDays(state),
      initiatorItemTime: selectExchangeOwnTime(state),
      partnerItemCount: selectExchangePartnerCount(state),
      partnerItemDays: selectExchangePartnerDays(state),
      partnerItemTime: selectExchangePartnerTime(state)
    })),
    lifecycle({
      componentWillMount() {
        if (isDataAbsent(this.props)) {
          this.props.onDataAbsent();
        }
      }
    }),
    branch(isDataAbsent, renderNothing)
  );
};
