import './ItemTile.scss';

import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import classNames from 'classnames';
import {Link} from 'react-router';
import Icon from '../../common/Icon/Icon';

const ItemTile = ({className, sizes, editable, imageUrl, currency, price, title, link, per}) => {
  const imgUrl = imageUrl || 'http://placehold.it/200x200';
  const Component = link ? Link : 'div';
  const props = link ? {to: link} : {};

  return (
    <Component
      {...props}
      className={classNames(sizes, 'item-tile', className, {
        'item-tile--link': link
      })}>
      <div className="item-tile__photo" style={{backgroundImage: `url(${imgUrl})`}}>
        {editable && (
          <div className="item-tile__actions">
            <Icon name="pencil" />
            <Icon name="delete" />
          </div>
        )}
      </div>
      <div className="item-tile__price">
        <span className="item-tile__price__value">
          {`${currency || ''} ${price.toFixed(2)}`.trim()}
        </span>
        {per && <span className="item-tile__price__per">{`/ ${per}`}</span>}
      </div>
      <Text className="item-tile__title" maxCharacters={40}>
        {title}
      </Text>
    </Component>
  );
};

ItemTile.propTypes = {
  className: PropTypes.string,
  sizes: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  imageUrl: PropTypes.string,
  currency: PropTypes.string,
  per: PropTypes.oneOf(['hour']),
  isLoading: PropTypes.bool
};

ItemTile.defaultProps = {
  editable: false
};

export default ItemTile;
