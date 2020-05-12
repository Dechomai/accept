import './DetailsModal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import classNames from 'classnames';
import {omit} from 'ramda';

import Icon from '../common/Icon/Icon';

const DetailsModal = ({children, changeModalVisibility, status, exchange, buttons = [], user}) => {
  const isPending = !!exchange.bcPendingTransactionHash;
  return (
    <Modal
      isOpen={true}
      className={classNames('details-modal', isPending && 'details-modal--pending')}
      size="lg"
      backdrop="static">
      <div className="details-modal__header">
        <div className="details-modal__title-wrapper">
          <h5 className="details-modal__title p-4">Exchange offer details</h5>
          <div
            className={classNames('exchange-offer__status', {
              [`exchange-offer__status--${status.modifier}`]: status.modifier
            })}>
            {status.title}
          </div>
        </div>
        <span className="details-modal__close" onClick={changeModalVisibility}>
          <Icon name="close" size="24" />
        </span>
      </div>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        {buttons
          .filter(({visible}) => !visible || visible(exchange, user))
          .map(({title, color, onClick, ...rest}) => (
            <Button
              key={title}
              color={color || 'primary'}
              onClick={() => onClick(exchange)}
              {...omit(['visible'], rest)}
              disabled={isPending}>
              {title}
            </Button>
          ))}
      </ModalFooter>
    </Modal>
  );
};

DetailsModal.propTypes = {
  changeModalVisibility: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired
};

export default DetailsModal;
