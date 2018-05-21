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
import {formatPrice} from '../../../utils/format';

class ItemTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      deletingInProgress: false,
      deletingError: false
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

  handleDeleteItem() {
    this.setState({
      deletingInProgress: true
    });
    this.props.onDeleteClick().catch(() => {
      this.setState({
        deletingInProgress: false,
        deletingError: true
      });
    });
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
    const formattedPrice = formatPrice(price, currency);
    return (
      <Component
        {...props}
        className={classNames(sizes, 'item-tile', className, {
          'item-tile--link': link
        })}>
        <div className="item-tile__photo" style={{backgroundImage: `url(${imgUrl})`}}>
          {editable && (
            <div className="item-tile__actions">
              <span className="item-tile__actions__btn" onClick={onEditClick}>
                <Icon name="pencil" />
              </span>
              <span
                className="item-tile__actions__btn"
                onClick={e => {
                  this.openConfirmationModal(e);
                }}>
                <Icon name="delete" />
              </span>
            </div>
          )}
        </div>
        <div className="item-tile__price">
          <span className="item-tile__price__value" title={formattedPrice}>
            {formattedPrice}
          </span>
          {per && <span className="item-tile__price__per">{`/ ${per}`}</span>}
        </div>
        <Text className="item-tile__title" maxCharacters={60}>
          {title}
        </Text>
        {editable && (
          <Modal isOpen={this.state.modal} toggle={this.toggle} className="confirmation-modal">
            <ModalHeader toggle={this.toggle}>Delete item</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this item? This can not be undone.</p>
              {this.state.deletingError && (
                <div className="alert alert-danger">Sorry, something went wrong</div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={this.toggle} disabled={this.state.deletingInProgress}>
                Cancel
              </Button>
              <Button
                color="danger"
                onClick={this.handleDeleteItem}
                disabled={this.state.deletingInProgress}>
                {this.state.deletingInProgress ? 'Deleting...' : 'Delete'}
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
