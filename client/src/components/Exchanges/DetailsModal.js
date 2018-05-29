import './DetailsModal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import classNames from 'classnames';
import {omit} from 'ramda';

const DetailsModal = ({children, changeModalVisibility, status, exchange, buttons = [], user}) => (
  <Modal isOpen={true} className="details-modal" size="lg" backdrop="static">
    <div className="details-modal__header">
      <h5 className="details-modal__title p-4">Exchange offer details</h5>
      <div
        className={classNames('exchange-offer__status', {
          [`exchange-offer__status--${status.modifier}`]: status.modifier
        })}>
        {status.title}
      </div>
    </div>
    <ModalBody>{children}</ModalBody>
    <ModalFooter>
      <Button color="link" onClick={changeModalVisibility}>
        Close
      </Button>
      {buttons
        .filter(({visible}) => !visible || visible(exchange, user))
        .map(({title, color, onClick, ...rest}) => (
          <Button
            key={title}
            color={color || 'primary'}
            onClick={() => onClick(exchange)}
            {...omit(['visible'], rest)}>
            {title}
          </Button>
        ))}
    </ModalFooter>
  </Modal>
);

DetailsModal.propTypes = {
  changeModalVisibility: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired
};

export default DetailsModal;
