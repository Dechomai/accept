import './Modal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';

const ExchangeModal = ({
  title,
  subtitle,
  onNextBtnClick,
  onCancelBtnClick,
  nextBtnDisabled,
  children
}) => (
  <Modal isOpen={true} toggle={onCancelBtnClick} className="exchange-modal" size="lg">
    <div className="exchange-modal__header">
      <h5 className="exchange-modal__title">{title}</h5>
      <p className="exchange-modal__subtitle">{subtitle}</p>
    </div>
    <ModalBody>{children}</ModalBody>
    <ModalFooter>
      <Button color="link" onClick={onCancelBtnClick}>
        Cancel
      </Button>
      <Button color="primary" disabled={nextBtnDisabled} onClick={onNextBtnClick}>
        Next
      </Button>
    </ModalFooter>
  </Modal>
);

ExchangeModal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  onCancelBtnClick: PropTypes.func.isRequired,
  onNextBtnClick: PropTypes.func.isRequired,
  nextBtnDisabled: PropTypes.bool.isRequired
};

export default ExchangeModal;
