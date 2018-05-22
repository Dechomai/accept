import './ConnectionCheck.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompact';
import autobind from 'autobindr';
import classNames from 'classnames';
import {Button} from 'reactstrap';
import {equals, allPass} from 'ramda';

import {
  selectExchangeItemType,
  selectExchangeItemId,
  selectExchangeOwnCount,
  selectExchangePartnerCount
} from '../../selectors';
import metamaskService from '../../services/metamask';
import clipboard from '../../services/clipboard';
import config from '../../config';
import Icon from '../common/Icon/Icon';
import withDataEnsurance from '../../hoc/exchange/withDataEnsurance';

const Step = ({title, success, children}) => (
  <div className="connection-step">
    <Icon
      name={success ? 'check-circle' : 'close-circle'}
      className={classNames(
        'connection-step__status',
        success ? 'connection-step__status--success' : 'connection-step__status--failure'
      )}
    />
    <div className="connection-step__content">
      <div className="connection-step__title">{title}</div>
      {!success && children}
    </div>
  </div>
);

Step.propTypes = {
  title: PropTypes.string.isRequired,
  success: PropTypes.bool
};

const WAIT_TIME = 1000;

class ConnectionCheck extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      ready: false,
      isPluginInstalled: null,
      isAccountSelected: null,
      isAcceptNetwork: null
    };
  }

  componentDidMount() {
    this.updateConnectionStatus();
    setTimeout(() => {
      this.setState({ready: true});
    }, WAIT_TIME);
  }

  componentDidUpdate(prevProps, prevState) {
    const {ready, isPluginInstalled, isAccountSelected, isAcceptNetwork} = this.state;
    if (
      ready &&
      isPluginInstalled &&
      isAccountSelected &&
      isAcceptNetwork &&
      !equals(prevState, this.state)
    )
      this.props.onSuccess();
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
        account => this.setState({isAccountSelected: account === this.props.address}),
        () => this.setState({isAccountSelected: false})
      );
  }

  copyNetworkUrlToClipboard() {
    clipboard.write(config.bcNetworkUrl);
  }

  render() {
    const {address} = this.props;
    const {isPluginInstalled, isAccountSelected, isAcceptNetwork} = this.state;

    return (
      <div className="connection-check">
        <Step title="Metamask Plugin" success={isPluginInstalled}>
          <div className="connection-check__description">
            Looks like you dont have <a href="https://metamask.io">MetaMask</a>, please install it
            and reload the page
          </div>
          {/* <Button onClick={this.updateConnectionStatus}>Refresh</Button> */}
        </Step>
        <Step title="Account connection" success={isAccountSelected}>
          {/*
                TODO: handle
                1. no account
                2. account not registered to this user
            */}
          <div className="connection-check__description">
            Please, select account with the following address, which is connected to our network
          </div>
          <div className="connection-check__sub-title">Account address</div>
          <div className="connection-check__address">{address}</div>
        </Step>
        <Step title="Join our Accept Pay Network" success={isAcceptNetwork}>
          <div className="connection-check__description">
            Please connect to custom RPC using the following URL (the page will be reloaded
            automatically)
          </div>
          <div className="connection-check__sub-title">Accept Pay Network URL</div>
          <div className="connection-check__network-url">
            {config.bcNetworkUrl}
            <Button color="copy" onClick={this.copyNetworkUrlToClipboard}>
              Copy
            </Button>
          </div>
        </Step>
      </div>
    );
  }
}

ConnectionCheck.propTypes = {
  address: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    dataAbsent: !allPass([
      selectExchangeItemType,
      selectExchangeItemId,
      selectExchangeOwnCount,
      selectExchangePartnerCount
    ])(state)
  };
};

export default compose(connect(mapStateToProps), withDataEnsurance())(ConnectionCheck);
