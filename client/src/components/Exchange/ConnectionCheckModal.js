import './ConnectionCheckModal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import autobind from 'autobindr';
import classNames from 'classnames';

import metamaskService from '../../services/metamask';
import clipboard from '../../services/clipboard';
import config from '../../config';
import Icon from '../common/Icon/Icon';

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
    this.state = {
      isPluginInstalled: null,
      isAccountSelected: null,
      isAcceptNetwork: null
    };
  }

  componentDidMount() {
    this.updateConnectionStatus();
  }

  updateConnectionStatus() {
    this.updatePluginStatus();
    this.updateNetworkStatus();
    this.updateAccountStatus();
  }

  updatePluginStatus() {
    metamaskService
      .isPluginInstalled()
      .then(
        () => this.setState({isPluginInstalled: true}),
        () => this.setState({isPluginInstalled: false})
      );
  }

  updateNetworkStatus() {
    metamaskService
      .isAcceptNetwork()
      .then(
        () => this.setState({isAcceptNetwork: true}),
        () => this.setState({isAcceptNetwork: false})
      );
  }

  updateAccountStatus() {
    metamaskService
      .getActiveAccount()
      .then(
        () => this.setState({isAccountSelected: true}),
        () => this.setState({isAccountSelected: false})
      );
  }

  copyNetworkUrlToClipboard() {
    clipboard.write(config.bcNetworkUrl);
  }

  render() {
    const {onCancelBtnClick} = this.props;
    const {isPluginInstalled, isAccountSelected, isAcceptNetwork} = this.state;
    const isConnectionChecked = ![isPluginInstalled, isAccountSelected, isAcceptNetwork].includes(
      null
    );
    const isConnected = isPluginInstalled && isAccountSelected && isAcceptNetwork;
    return (
      isConnectionChecked &&
      !isConnected && (
        <Modal isOpen className="connection-check-modal">
          <ModalBody>
            <h4 className="connection-check-modal__title">Connection Check</h4>
            <div className="connection-check-modal__description px-4">
              You can not proceed with smart contract action. Please, meet the following
              requirements
            </div>
            <div className="connection-check-modal__steps">
              <Step title="Metamask Plugin" success={isPluginInstalled}>
                <div className="connection-check-modal__description">
                  Looks like you dont have <a href="https://metamask.io">MetaMask</a>, please
                  install it and reload the page
                </div>
              </Step>
              <Step title="Account connection" success={isAccountSelected}>
                <div className="connection-check-modal__description">
                  Please sign in to an account which will be connected to our network
                </div>
              </Step>
              <Step title="Join our Accept Pay Network" success={isAcceptNetwork}>
                <div className="connection-check-modal__description">
                  Please connect to custom RPC using the following URL (the page will be reloaded
                  automatically)
                </div>
                <div className="connection-check-modal__sub-title">Accept Pay Network URL</div>
                <div className="connection-check-modal__network-url">
                  {config.bcNetworkUrl}
                  <Button color="copy" onClick={this.copyNetworkUrlToClipboard}>
                    Copy
                  </Button>
                </div>
              </Step>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="link" onClick={onCancelBtnClick}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.updateConnectionStatus}>
              Proceed
            </Button>
          </ModalFooter>
        </Modal>
      )
    );
  }
}

ConnectionCheckModal.propTypes = {
  onCancelBtnClick: PropTypes.func.isRequired
};

export default ConnectionCheckModal;
