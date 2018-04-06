import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import Icon from '../Icon/Icon';
import classNames from 'classnames';

class NewOffer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {className, type, placeholder} = this.props;

    return (
      <Link to={`/${type}/add`} className={classNames('offer', 'offer--new', className || '')}>
        <Icon className="offer__icon" name="plus" />
        <div className="offer__placeholder">{placeholder}</div>
      </Link>
    );
  }
}

NewOffer.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['product', 'service']).isRequired,
  placeholder: PropTypes.string.isRequired
};

export default NewOffer;
