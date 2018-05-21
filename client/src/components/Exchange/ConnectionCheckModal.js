import './ConnectionCheckModal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';

import ConnectionCheck from './ConnectionCheck';

const ConnectionCheckModal = ({onCancelBtnClick, address, onSuccess}) => (
  <Modal isOpen className="connection-check-modal">
    <ModalBody>
      <h4 className="connection-check-modal__title">Connection Check</h4>
      <div className="connection-check-modal__description px-4">
        You can not proceed with smart contract action. Please, meet the following requirements
      </div>
      <ConnectionCheck address={address} onSuccess={onSuccess} />
    </ModalBody>
    <ModalFooter>
      <Button color="link" onClick={onCancelBtnClick}>
        Cancel
      </Button>
      {/* <Button color="primary" onClick={}>
              Proceed
            </Button> */}
    </ModalFooter>
  </Modal>
);

ConnectionCheckModal.propTypes = {
  address: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancelBtnClick: PropTypes.func.isRequired
};

export default ConnectionCheckModal;
