import React from 'react';
import withDataEnsurance from '../../hoc/exchange/withDataEnsurance';
import ConnectionCheck from '../../components/Exchange/ConnectionCheck';

export default withDataEnsurance([
  'initiatorItemType',
  'initiatorItemId',
  'initiatorItemCount',
  'partnerItemCount'
])(({getRef, ...props}) => <ConnectionCheck ref={getRef} {...props} />);
