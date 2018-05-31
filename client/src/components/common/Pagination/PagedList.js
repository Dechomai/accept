import React from 'react';
import PropTypes from 'prop-types';

class PagedList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page !== nextProps.page && this.list) {
      this.list.scroll({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  render() {
    const {className, children} = this.props;
    return (
      <div className={className} ref={el => (this.list = el)}>
        {children}
      </div>
    );
  }
}

PagedList.propTypes = {
  className: PropTypes.string,
  page: PropTypes.number.isRequired
};

export default PagedList;
