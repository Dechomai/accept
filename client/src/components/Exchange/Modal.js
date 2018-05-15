import './Modal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';

const ExchangeModal = ({
  title,
  subtitle,
  showFooter,
  backBtnDisabled,
  cancelBtnDisabled,
  nextBtnDisabled,
  nextBtnCaption,
  onNextBtnClick,
  onBackBtnClick,
  onCancelBtnClick,
  children
}) => (
  <Modal
    isOpen={true}
    toggle={onCancelBtnClick}
    className="exchange-modal"
    size="lg"
    backdrop="static">
    <div className="exchange-modal__header">
      <h5 className="exchange-modal__title">{title}</h5>
      <p className="exchange-modal__subtitle">{subtitle}</p>
    </div>
    <ModalBody>{children}</ModalBody>
    {showFooter && (
      <ModalFooter>
        <Button color="link" disabled={backBtnDisabled} onClick={onBackBtnClick}>
          Back
        </Button>
        <div>
          <Button color="link" disabled={cancelBtnDisabled} onClick={onCancelBtnClick}>
            Cancel
          </Button>
          <Button color="primary" disabled={nextBtnDisabled} onClick={onNextBtnClick}>
            {nextBtnCaption}
          </Button>
        </div>
      </ModalFooter>
    )}
  </Modal>
);

ExchangeModal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  showFooter: PropTypes.bool.isRequired,
  backBtnDisabled: PropTypes.bool.isRequired,
  cancelBtnDisabled: PropTypes.bool.isRequired,
  nextBtnDisabled: PropTypes.bool.isRequired,
  onCancelBtnClick: PropTypes.func.isRequired,
  onNextBtnClick: PropTypes.func.isRequired,
  onBackBtnClick: PropTypes.func.isRequired,
  nextBtnCaption: PropTypes.string.isRequired
};

export default ExchangeModal;
