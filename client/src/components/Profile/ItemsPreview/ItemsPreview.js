import './ItemsPreview.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button} from 'reactstrap';
import ItemTile from '../../common/ItemTile/ItemTile';
import NewItemTile from '../../common/ItemTile/NewItemTile';
import Icon from '../../common/Icon/Icon';

class ItemsPreview extends React.Component {
  render() {
    const {title, type, newPlaceholder, items} = this.props;

    return (
      <div className="about__items">
        <div className="about__items__header">
          <div className="mr-auto">{title}</div>
          <Link to={`/profile/${type}`}>
            <Button size="sm" color="link" className="p-0 btn-with-icon">
              <span>View all</span>
              <Icon name="menu-right" />
            </Button>
          </Link>
        </div>
        <div className="container-fluid">
          <div className="row about__items__container">
            <NewItemTile placeholder={newPlaceholder} type={type} sizes="col-3" />
            {items.map(item => (
              <ItemTile
                key={item.id}
                editable
                link={`/${type}/${item.id}`}
                price={item.price}
                title={item.title}
                imageUrl={item.photos.length ? item.photos.find(p => p.primary).uri : null}
                sizes="col-3"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ItemsPreview.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['products', 'services']).isRequired,
  newPlaceholder: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ItemsPreview;
