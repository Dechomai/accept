import React from 'react';
import {Modal, ModalBody} from 'reactstrap';

const ExchangesModal = ({children}) => (
  <Modal isOpen={true} className="exchange-modal" size="lg" backdrop="static">
    <ModalBody>{children}</ModalBody>
  </Modal>
);

export default ExchangesModal;
