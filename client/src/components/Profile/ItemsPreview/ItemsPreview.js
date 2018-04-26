import './ItemsPreview.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button} from 'reactstrap';

import NewItemTile from '../../common/Item/NewItemTile';
import ItemsList from '../../common/Item/List';
import Icon from '../../common/Icon/Icon';

class ItemsPreview extends React.Component {
  render() {
    const {
      title,
      type,
      newPlaceholder,
      items,
      editable,
      viewAllLink,
      onEditClick,
      onDeleteClick
    } = this.props;

    return (
      <div className="about__items">
        <div className="about__items__header">
          <div className="mr-auto">{title}</div>
          <Link to={viewAllLink}>
            <Button size="sm" color="link" className="p-0 btn-with-icon">
              <span>View all</span>
              <Icon name="menu-right" />
            </Button>
          </Link>
        </div>
        <div className="container-fluid">
          <div className="row about__items__container">
            {editable && <NewItemTile placeholder={newPlaceholder} type={type} sizes="col-3" />}
            <ItemsList
              type={type}
              list={items}
              tileSize={'col-3'}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              editable={editable}
            />
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
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editable: PropTypes.bool,
  viewAllLink: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired
};

export default ItemsPreview;
