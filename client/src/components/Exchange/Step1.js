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
            <div className="exchange-modal__offer">
              <h6 className="exchange-modal__content__header">Your Offer</h6>
            </div>
            <div className="exchange-modal__item-for-exchange">
              <h6 className="exchange-modal__content__header">{this.props.item.title}</h6>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="link" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary">Next</Button>
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
