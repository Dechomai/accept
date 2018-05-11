import './Step3.scss';

import React from 'react';
import {Button, Alert} from 'reactstrap';
import Icon from '../common/Icon/Icon';

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
      <div className="sign-up">
        <div className="container">
          {this.getPluginStatus()}
          {this.getNetworkStatus()}
          {this.getAccountStatus()}
          <div className="row justify-content-center">
            <div className="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-8">
              <div className="sign-up-step3 mt-5">
                <div className="sign-up-step3__block">
                  <div className="row">
                    <div className="col-8">
                      <div className="sign-up-step3__info">
                        <div className="sign-up-step3__status" />
                        <h5 className="sign-up-step3__header">Metamask Plugin</h5>
                        <p className="sign-up-step3__description">
                          Looks like you don`t have MetaMask, please install it by the following
                          link <a href="https://metamask.io/">metamask.io</a> and press check again
                        </p>
                        <Button outline color="primary">
                          Check again
                        </Button>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="sign-up-step3__photo">
                        <img
                          className="sign-up-step3__photo__img"
                          src="/assets/img/metamask-plugin.png"
                          alt="Accept"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sign-up-step3__block">
                  <div className="row">
                    <div className="col-8">
                      <div className="sign-up-step3__info">
                        <div className="sign-up-step3__status sign-up-step3__status--failed" />
                        <h5 className="sign-up-step3__header">Account connection</h5>
                        <p className="sign-up-step3__description">
                          Please, create/select MetaMask account which you would like to connect to
                          our Accept Pay Network and press <b>connect account button</b>
                        </p>
                        <Alert color="warning">
                          <Icon name="alert" size="16" />
                          <div>Once you connect Account, you couldn’t change it.</div>
                        </Alert>
                        <div className="form-group">
                          <label>Account address</label>
                          <input className="form-control" type="text" />
                        </div>
                        <Button outline color="primary">
                          Connect account
                        </Button>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="sign-up-step3__photo">
                        <img
                          className="sign-up-step3__photo__img"
                          src="/assets/img/acc-connection.png"
                          alt="Accept"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sign-up-step3__block">
                  <div className="row">
                    <div className="col-8">
                      <div className="sign-up-step3__info">
                        <div className="sign-up-step3__status sign-up-step3__status--completed" />
                        <h5 className="sign-up-step3__header">Join our Accept Pay Network</h5>
                        <p className="sign-up-step3__description">
                          Please, connect to custom RPC and incert following URL
                        </p>
                        <Alert color="warning">
                          <Icon name="alert" size="16" />
                          <div>Once you connect Account, you couldn’t change it.</div>
                        </Alert>
                        <div className="form-group">
                          <label>Accept Pay Network URL</label>
                          <input className="form-control" type="text" />
                        </div>
                        <Button outline color="primary">
                          Check connection
                        </Button>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="sign-up-step3__photo">
                        <img
                          className="sign-up-step3__photo__img"
                          src="/assets/img/join-accept.png"
                          alt="Accept"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sign-up__footer">
          <button className="btn btn-primary">Create profile</button>
        </div>
      </div>
    );
  }
}

SignUpStep3.propTypes = {};

export default SignUpStep3;
