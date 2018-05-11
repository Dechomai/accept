import './Step3.scss';

import React from 'react';

import metamaskService from '../../services/metamask';

const ACCOUNT_REGEX = /^0x[a-fA-F0-9]{40}$/;

class SignUpStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPluginInstalled: null,
      isAcceptNetwork: null,
      activeAccount: null
    };
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      this.updatePluginStatus();
      this.updateNetworkStatus();
      this.updateAccountStatus();
    });
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
    metamaskService.isAcceptNetwork().then(
      () => this.setState({isAcceptNetwork: true}),
      () => {
        this.setState({isAcceptNetwork: 'Error retrieving network information' || false});
      }
    );
  }

  updateAccountStatus() {
    metamaskService
      .getActiveAccount()
      .then(
        account => this.setState({activeAccount: account}),
        () => this.setState({activeAccount: 'Error retrieving account information' || false})
      );
  }

  getPluginStatus() {
    if (this.state.isPluginInstalled === null) return null;
    if (!this.state.isPluginInstalled)
      return <h1 className="bg-danger p-4 text-white">Metamask plugin is not installed </h1>;
    return <h1 className="bg-success p-4 text-white">Metamask plugin is intalled</h1>;
  }

  getNetworkStatus() {
    if (this.state.isAcceptNetwork === null) return null;
    if (this.state.isAcceptNetwork !== true)
      return (
        <h1 className="bg-danger p-4 text-white">
          {this.state.isAcceptNetwork || 'Wrong network'}
        </h1>
      );
    return <h1 className="bg-success p-4 text-white">Accept network</h1>;
  }

  getAccountStatus() {
    if (this.state.activeAccount === null) return null;
    if (!ACCOUNT_REGEX.test(this.state.activeAccount))
      return (
        <h1 className="bg-danger p-4 text-white">
          {this.state.activeAccount || 'No active account'}
        </h1>
      );
    return <h1 className="bg-success p-4 text-white">Account: {this.state.activeAccount}</h1>;
  }

  render() {
    return (
      <div className="sign-up-step3">
        {this.getPluginStatus()}
        {this.getNetworkStatus()}
        {this.getAccountStatus()}
      </div>
    );
  }
}

SignUpStep3.propTypes = {};

export default SignUpStep3;
