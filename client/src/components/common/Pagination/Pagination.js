import './Pagination.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import classNames from 'classnames';
import {range} from 'ramda';
import autobind from 'autobindr';

import Icon from '../Icon/Icon';

// generate pagination sequences
// < 1 2 3 >
// < 1 2 3 ... 10 >
// < 1 ...3 4 5... 10 >
// etc.
const paginationRange = total => range(0, total);

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  updatePage(updateFn) {
    const {router, location, currentPage} = this.props;
    router.push({
      pathname: location.pathname,
      query: {
        page: updateFn(currentPage + 1)
      }
    });
  }

  onPrevClick() {
    if (this.props.onPrevClick) {
      this.props.onPrevClick();
    } else {
      this.updatePage(page => --page);
    }
  }

  onNextClick() {
    if (this.props.onNextClick) {
      this.props.onNextClick();
    } else {
      this.updatePage(page => ++page);
    }
  }

  onPageClick(pageIndex) {
    if (this.props.onPageClick) {
      this.props.onPageClick(pageIndex);
    } else {
      this.updatePage(() => pageIndex + 1);
    }
  }

  render() {
    const {currentPage, totalPages} = this.props;
    const {onPrevClick, onNextClick, onPageClick} = this;
    const page = currentPage < 0 || currentPage >= totalPages ? 0 : currentPage;

    return (
      <div className="pagination pagination-sm">
        <div
          className={classNames('page-item', {
            disabled: page === 0
          })}>
          <span className="page-link" onClick={onPrevClick}>
            <Icon name="chevron-left" size="16" />
          </span>
        </div>
        {paginationRange(totalPages, page).map(i => (
          <div
            key={i}
            className={classNames('page-item', {
              active: page === i
            })}
            onClick={() => onPageClick(i)}>
            <span className="page-link">{i + 1}</span>
          </div>
        ))}
        <div
          className={classNames('page-item', {
            disabled: page === totalPages - 1
          })}>
          <span className="page-link" onClick={onNextClick}>
            <Icon name="chevron-right" size="16" />
          </span>
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageClick: PropTypes.func,
  onNextClick: PropTypes.func,
  onPrevClick: PropTypes.func
};

export default withRouter(Pagination);
