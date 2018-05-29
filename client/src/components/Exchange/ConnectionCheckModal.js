import './ConnectionCheckModal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import ConnectionCheck from './ConnectionCheck';

class ConnectionCheckModal extends React.Component {
  constructor() {
    super();
    autobind(this);
    this.connectionCheck = null;
  }

  handleRefreshBtn() {
    this.connectionCheck && this.connectionCheck.updateConnectionStatus();
  }

  render() {
    const {onCancelBtnClick, address, onSuccess} = this.props;
    return (
      <Modal isOpen className="connection-check-modal">
        <ModalHeader>
          Connection Check
          {/* <h4 className="connection-check-modal__title"></h4> */}
        </ModalHeader>
        <ModalBody>
          {/* <div className="connection-check-modal__description px-4">
            You can not proceed with smart contract action. Please, meet the following requirements
          </div> */}
          <ConnectionCheck
            ref={el => {
              this.connectionCheck = el;
            }}
            address={address}
            onSuccess={onSuccess}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={onCancelBtnClick}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.handleRefreshBtn}>
            Refresh
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ConnectionCheckModal.propTypes = {
  address: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancelBtnClick: PropTypes.func.isRequired
};

export default ConnectionCheckModal;
