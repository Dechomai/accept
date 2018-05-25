import './ExchangeAvailability.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Days, Time} from '../../constants/exchange';

const ExchangeAvailability = ({className, days, time, prefered}) => {
  const daysSpecified = days.length > 0;
  const timeSpecified = time.length > 0;

  return daysSpecified || timeSpecified ? (
    <div className={classNames('exchange-availability', className)}>
      {prefered ? 'Availability: ' : 'Prefered: '}
      <strong>{days.map(index => Days[index]).join(', ')}</strong>
      {daysSpecified && timeSpecified ? ' in the ' : ''}
      <strong>{time.map(index => Time[index]).join(', ')}</strong>
    </div>
  ) : null;
};

ExchangeAvailability.propTypes = {
  className: PropTypes.string,
  days: PropTypes.arrayOf(PropTypes.number),
  time: PropTypes.arrayOf(PropTypes.number),
  prefered: PropTypes.bool
};

export default ExchangeAvailability;
