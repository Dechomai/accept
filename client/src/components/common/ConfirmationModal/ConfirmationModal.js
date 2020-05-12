import './ConfirmationModal.scss';

import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import PropTypes from 'prop-types';

const ConfirmationModal = ({
  confirmationAction,
  closeModal,
  confirmationText,
  btnName,
  btnColor,
  headerText
}) => {
  return (
    <Modal isOpen={true} className="confirmation-modal" size="lg">
      <ModalHeader>{headerText}</ModalHeader>
      <ModalBody>
        <p>{confirmationText}</p>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            closeModal();
          }}
          color="light">
          No
        </Button>
        <Button
          onClick={() => {
            confirmationAction();
          }}
          color={btnColor}>
          {btnName}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  confirmationAction: PropTypes.func,
  closeModal: PropTypes.func,
  confirmationText: PropTypes.string,
  btnName: PropTypes.string,
  btnColor: PropTypes.string,
  headerText: PropTypes.string
};

export default ConfirmationModal;
