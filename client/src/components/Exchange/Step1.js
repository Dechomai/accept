import './exchange-modal.scss';

import React from 'react';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';

class ExchangeStep1 extends React.Component {
  constructor(props) {
    super(props);
  }

  renderModal() {
    const {toggle, isOpen} = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} className="exchange-modal" size="lg">
          <div className="exchange-modal__header">
            <h5 className="exchange-modal__title">Offer to Exchange</h5>
            <p className="exchange-modal__subtitle">Step 1. Set offer</p>
          </div>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Do Something</Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  render() {
    return <div>{this.renderModal()}</div>;
  }
}

export default ExchangeStep1;
