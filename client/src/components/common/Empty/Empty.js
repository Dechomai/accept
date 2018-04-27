import './Empty.scss';

import React from 'react';
import PropTypes from 'prop-types';

const Empty = ({type}) => (
  <div className="empty">
    <img className="empty__image" src={`/assets/img/${type}.png`} alt="" />
    <div className="empty__text">{type === 'product' ? 'No listings yet' : 'No services yet'}</div>
  </div>
);

Empty.propTypes = {
  type: PropTypes.oneOf(['product', 'service']).isRequired
};

export default Empty;
