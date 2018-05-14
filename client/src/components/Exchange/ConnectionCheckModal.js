import './ConnectionCheckModal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Input, Modal, ModalBody, ModalFooter} from 'reactstrap';
import autobind from 'autobindr';
import classNames from 'classnames';

import {bcNetworkUrl} from '../../config';
import Icon from '../common/Icon/Icon';

const ConnectionSteps = {
  PLUGIN: 0,
  ACCOUNT: 1,
  NETWORK: 2
};

const Step = ({title, success, children}) => (
  <div className="connection-step">
    <Icon
      name={success ? 'check-circle' : 'close-circle'}
      className={classNames(
        'connection-step__status',
        success ? 'connection-step__status--success' : 'connection-step__status--failure'
      )}
    />
    <div className="d-flex flex-column">
      <div className="connection-step__title">{title}</div>
      {!success && children}
    </div>
  </div>
);

class ConnectionCheckModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {isOpen: true};
  }

  onCancelBtnClick() {
    this.setState({isOpen: false});
    this.props.onCancelBtnClick();
  }

  render() {
    const {onProceedBtnClick, step} = this.props;
    const {isOpen} = this.state;
    return (
      <Modal isOpen={isOpen} className="connection-check-modal">
        <ModalBody>
          <h4 className="connection-check-modal__title">Connection Check</h4>
          <div className="connection-check-modal__description px-4">
            You can not proceed with smart contract action. Please, meet the following requirements
          </div>
          <div className="connection-check-modal__steps">
            <Step title="Metamask Plugin" success={step > ConnectionSteps.PLUGIN}>
              <div className="connection-check-modal__description">
                Looks like you dont have <a href="https://metamask.io">MetaMask</a>, please install
                it and reload the page
              </div>
            </Step>
            <Step title="Account connection" success={step > ConnectionSteps.ACCOUNT}>
              <div className="connection-check-modal__description">
                Please sign in to an account which will be connected to our network
              </div>
            </Step>
            <Step title="Join our Accept Pay Network" success={step > ConnectionSteps.NETWORK}>
              <div className="connection-check-modal__description">
                Please connect to custom RPC using the following URL (the page will be reloaded
                automatically)
              </div>
              <div className="connection-check-modal__sub-title">Accept Pay Network URL</div>
              <Input value={bcNetworkUrl} readOnly />
            </Step>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="link" onClick={this.onCancelBtnClick}>
            Cancel
          </Button>
          <Button color="primary" onClick={onProceedBtnClick}>
            Proceed
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ConnectionCheckModal.propTypes = {
  step: PropTypes.number.isRequired,
  onCancelBtnClick: PropTypes.func.isRequired,
  onProceedBtnClick: PropTypes.func.isRequired
};

export default ConnectionCheckModal;
