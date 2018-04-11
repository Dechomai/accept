import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import Icon from '../Icon/Icon';
import classNames from 'classnames';

const NewItemTile = props => (
  <Link
    to={`/${props.type}/add`}
    className={classNames(props.sizes, 'item-tile', 'item-tile--new', props.className || '')}>
    <Icon className="item-tile__icon" name="plus" />
    <div className="item-tile__placeholder">{props.placeholder}</div>
  </Link>
);

NewItemTile.propTypes = {
  sizes: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['product', 'service']).isRequired,
  placeholder: PropTypes.string.isRequired
};

export default NewItemTile;
