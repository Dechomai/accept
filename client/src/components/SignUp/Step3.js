import './Step3.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobindr';
import {Button, Alert} from 'reactstrap';

import metamaskService from '../../services/metamask';
import clipboard from '../../services/clipboard';
import config from '../../config/index';
import Icon from '../common/Icon/Icon';
import Loader from '../common/Loader/Loader';
import SignUpStep4 from './Step4';

const ACCOUNT_REGEX = /^0x[a-fA-F0-9]{40}$/;

class SignUpStep3 extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      isPluginInstalled: null,
      activeAccount: null,
      isAcceptNetwork: null
    };
  }

  componentDidMount() {
    this.updatePluginStatus();
    this.updateNetworkStatus();
    this.updateAccountStatus();
  }

  reloadPage() {
    location.reload();
  }

  copyNetworkUrlToClipboard() {
    clipboard.write(config.bcNetworkUrl);
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
    metamaskService.getActiveAccount().then(
      account => {
        ACCOUNT_REGEX.test(account) ? this.setState({activeAccount: account}) : false;
      },
      () => this.setState({activeAccount: false})
    );
  }

  renderCheckPlugin() {
    return (
      <div className="sign-up-step3__block">
        <div className="row">
          <div className="col-8">
            <div className="sign-up-step3__info">
              <div
                className={classNames('sign-up-step3__status', {
                  'sign-up-step3__status--completed': this.state.isPluginInstalled,
                  'sign-up-step3__status--failed': !this.state.isPluginInstalled
                })}
              />
              <h5 className="sign-up-step3__header">Metamask Plugin</h5>
              {!this.state.isPluginInstalled && (
                <React.Fragment>
                  <p className="sign-up-step3__description">
                    Looks like you don`t have MetaMask, please install it by the following link{' '}
                    <a href="https://metamask.io/">metamask.io</a> and press check again
                  </p>
                  <Button
                    outline
                    color="primary"
                    disabled={this.state.isPluginInstalled}
                    onClick={this.reloadPage}>
                    Check again
                  </Button>
                </React.Fragment>
              )}
            </div>
          </div>
          {!this.state.isPluginInstalled && (
            <div className="col-4">
              <div className="sign-up-step3__photo">
                <img
                  className="sign-up-step3__photo__img"
                  src="/assets/img/metamask-plugin.png"
                  alt="Accept"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  renderCheckAccount() {
    return (
      <div className="sign-up-step3__block">
        <div className="row">
          <div className="col-8">
            <div className="sign-up-step3__info">
              <div
                className={classNames('sign-up-step3__status', {
                  'sign-up-step3__status--completed': this.state.activeAccount,
                  'sign-up-step3__status--failed': !this.state.activeAccount
                })}
              />
              <h5 className="sign-up-step3__header">Account connection</h5>
              {!this.state.activeAccount && (
                <React.Fragment>
                  <p className="sign-up-step3__description">
                    Please, create/select MetaMask account which you would like to connect to our
                    Accept Pay Network and press <b>connect account button</b>
                  </p>
                  <Alert color="warning">
                    <Icon name="alert" size="16" />
                    <div>Once you connect Account, you couldn`t change it.</div>
                  </Alert>
                  <div className="form-group">
                    <label>Account address</label>
                    <p className="sign-up-step3__description">
                      {this.state.activeAccount || 'Error retrieving account information'}
                    </p>
                  </div>
                  <Button outline color="primary" onClick={this.updateAccountStatus}>
                    Refresh
                  </Button>
                </React.Fragment>
              )}
            </div>
          </div>
          {!this.state.activeAccount && (
            <div className="col-4">
              <div className="sign-up-step3__photo">
                <img
                  className="sign-up-step3__photo__img"
                  src="/assets/img/acc-connection.png"
                  alt="Accept"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  renderCheckNetwork() {
    return (
      <div className="sign-up-step3__block">
        <div className="row">
          <div className="col-8">
            <div className="sign-up-step3__info">
              <div
                className={classNames('sign-up-step3__status', {
                  'sign-up-step3__status--completed': this.state.isAcceptNetwork,
                  'sign-up-step3__status--failed': !this.state.isAcceptNetwork
                })}
              />
              <h5 className="sign-up-step3__header">Join Ropsten Test Network</h5>
              {!this.state.isAcceptNetwork && (
                <React.Fragment>
                  <p className="sign-up-step3__description">
                    Please connect to Ropsten Test Network within your MetaMask (the page will be
                    reloaded automatically)
                  </p>

                  <Alert color="warning">
                    <Icon name="alert" size="16" />
                    <div>
                      You have to be in Ropsten network to proceed with exchanges or other
                      transactions
                    </div>
                  </Alert>
                  <Button outline color="primary" onClick={this.updateNetworkStatus}>
                    Check connection
                  </Button>
                </React.Fragment>
              )}
            </div>
          </div>
          {!this.state.isAcceptNetwork && (
            <div className="col-4">
              <div className="sign-up-step3__photo">
                <img
                  className="sign-up-step3__photo__img"
                  src="/assets/img/join-accept.png"
                  alt="Accept"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const {onSubmit, loading, onClickOk} = this.props;

    // TODO: show error
    return (
      <React.Fragment>
        {this.props.step4Visible ? (
          <SignUpStep4
            onClickOk={() => {
              onClickOk(this.state.activeAccount);
            }}
          />
        ) : (
          <div className="sign-up">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-8">
                  {loading && <Loader />}
                  <div
                    className={classNames('sign-up-step3', {
                      'sign-up-step3--loading': loading
                    })}>
                    {this.renderCheckPlugin()}
                    {this.renderCheckAccount()}
                    {this.renderCheckNetwork()}
                  </div>
                </div>
              </div>
            </div>
            <div className="sign-up__footer">
              <Button
                color="primary"
                onClick={() => {
                  onSubmit({
                    address: this.state.activeAccount
                  }).then(() => {
                    this.props.changeStep4Visibility();
                  });
                }}
                disabled={
                  !this.state.isPluginInstalled ||
                  !this.state.activeAccount ||
                  this.state.isAcceptNetwork !== true
                }>
                Create profile
              </Button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

SignUpStep3.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
  onClickOk: PropTypes.func.isRequired,
  changeStep4Visibility: PropTypes.func.isRequired
};

export default SignUpStep3;
