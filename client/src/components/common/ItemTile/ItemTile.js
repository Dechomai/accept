import './ItemTile.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import classNames from 'classnames';
import {Link} from 'react-router';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';

import Text from '../Text/Text';
import Icon from '../../common/Icon/Icon';
import {getImageThumbnail} from '../../../utils/img';

class ItemTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    autobind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  openConfirmationModal(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggle();
  }

  handleDeleteItem(e) {
    this.toggle(e);
    this.props.onDeleteClick();
  }

  render() {
    const {
      className,
      sizes,
      editable,
      onEditClick,
      imageUrl,
      currency,
      price,
      title,
      link,
      per
    } = this.props;

    const imgUrl = imageUrl ? getImageThumbnail(imageUrl) : '/assets/img/placeholder.png';
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
              <span onClick={onEditClick}>
                <Icon name="pencil" />
              </span>
              <span
                onClick={e => {
                  this.openConfirmationModal(e);
                }}>
                <Icon name="delete" />
              </span>
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
        {editable && (
          <Modal isOpen={this.state.modal} toggle={this.toggle} className="confirmation-modal">
            <ModalHeader toggle={this.toggle}>Delete item</ModalHeader>
            <ModalBody>Do you really want to delete {title} ?</ModalBody>
            <ModalFooter>
              <Button color="link" onClick={this.toggle}>
                Cancel
              </Button>
              <Button color="danger" onClick={this.handleDeleteItem}>
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Component>
    );
  }
}

ItemTile.propTypes = {
  className: PropTypes.string,
  sizes: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
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
