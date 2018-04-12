import './Pagination.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {range} from 'ramda';

import Icon from '../Icon/Icon';

// generate pagination sequences
// < 1 2 3 >
// < 1 2 3 ... 10 >
// < 1 ...3 4 5... 10 >
// etc.
const paginationRange = total => range(0, total + 1);

const Pagination = ({currentPage, totalPages, onPrevClick, onNextClick, onPageClick}) => (
  <div className="pagination pagination-sm">
    <div
      className={classNames('page-item', {
        disabled: currentPage === 0
      })}>
      <span className="page-link" onClick={onPrevClick}>
        <Icon name="chevron-left" size="16" />
      </span>
    </div>
    {paginationRange(totalPages, currentPage).map(i => (
      <div
        key={i}
        className={classNames('page-item', {
          active: currentPage === i
        })}
        onClick={() => onPageClick(i)}>
        <span className="page-link">{i + 1}</span>
      </div>
    ))}
    <div
      className={classNames('page-item', {
        disabled: currentPage === totalPages
      })}>
      <span className="page-link" onClick={onNextClick}>
        <Icon name="chevron-right" size="16" />
      </span>
    </div>
  </div>
);

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,

  onPageClick: PropTypes.func,
  onNextClick: PropTypes.func,
  onPrevClick: PropTypes.func
};

export default Pagination;
