import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import StepSignature from '../../containers/Exchange/StepSignature';

class SignatureModal extends React.Component {
  render() {
    const {onCancelBtnClick, onSigned} = this.props;
    return (
      <Modal isOpen size="lg" className="signature-modal">
        <ModalHeader>Sign Offer</ModalHeader>
        <ModalBody>
          <StepSignature onSigned={onSigned} />
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={onCancelBtnClick}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

SignatureModal.propTypes = {
  onSigned: PropTypes.func.isRequired,
  onCancelBtnClick: PropTypes.func.isRequired
};

export default SignatureModal;
