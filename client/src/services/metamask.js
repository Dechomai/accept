import Web3 from 'web3';

import config from '../config';
import exchangeContractData from '../config/contracts/exchange';
import tokenContractData from '../config/contracts/token';

const NETWORK_ID = config.bcNetworkId;
const EXCHANGE_GAS_LIMIT = '2000000';

class MetaMask {
  constructor() {
    this.web3 = null;
  }

  getWeb3() {
    /* global web3: false */
    if (this.web3) return Promise.resolve(this.web3);
    return this.isPluginInstalled().then(() => new Web3(web3.currentProvider));
  }

  isPluginInstalled() {
    /* global web3: false */
    if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) return Promise.resolve();
    return Promise.reject();
  }

  isAcceptNetwork() {
    return this.isPluginInstalled()
      .then(() => this.getWeb3())
      .then(
        web3 =>
          new Promise((resolve, reject) => {
            web3.version.getNetwork((err, networkId) => {
              if (err) return reject(err);
              if (networkId !== NETWORK_ID) return reject('Wrong network');
              resolve();
            });
          })
      );
  }

  getActiveAccount() {
    return this.isPluginInstalled()
      .then(() => this.getWeb3())
      .then(
        web3 =>
          new Promise((resolve, reject) => {
            web3.eth.getAccounts((err, accounts) => {
              if (err) return reject(err);
              if (!accounts.length) return reject('No active account');
              resolve(accounts[0]);
            });
          })
      );
  }

  createExchangeContract({
    initiatorItemName,
    initiatorItemQuantity,
    partnerItemName,
    partnerItemQuantity,
    partnerAddress,
    price
  }) {
    return Promise.all([this.isPluginInstalled(), this.isAcceptNetwork()])
      .then(() => Promise.all([this.getActiveAccount(), this.getWeb3(), this.getTokenContract()]))
      .then(([address, web3, tokenContract]) => {
        const value = web3.toWei(price, 'ether');

        return new Promise((resolve, reject) => {
          tokenContract.approveAndInitiateExchange(
            initiatorItemName,
            initiatorItemQuantity,
            partnerItemName,
            partnerItemQuantity,
            value,
            partnerAddress,
            {
              from: address,
              gas: EXCHANGE_GAS_LIMIT
            },
            (err, txHash) => {
              if (err) return reject(err);
              resolve(txHash);
            }
          );
        });
      });
  }

  getTokenContract() {
    return this.getWeb3().then(web3 =>
      web3.eth.contract(tokenContractData.abi).at(config.bcTokenContractAddress)
    );
  }

  getExchangeContract(contractAddress) {
    return this.getWeb3().then(web3 =>
      web3.eth.contract(exchangeContractData.abi).at(contractAddress)
    );
  }

  cancelExchangeContract({exchange, user}) {
    return this.getExchangeContract(exchange.bcContractAddress).then(
      contract =>
        new Promise((resolve, reject) => {
          contract.cancel({from: user.bcDefaultAccountAddress}, (err, txHash) => {
            if (err) return reject(err);
            resolve(txHash);
          });
        })
    );
  }

  acceptExchangeContract({exchange, user}) {
    return this.getTokenContract().then(
      tokenContract =>
        new Promise((resolve, reject) => {
          tokenContract.approveAndAccept(
            exchange.bcContractAddress,
            {
              from: user.bcDefaultAccountAddress
            },
            (err, txHash) => {
              if (err) return reject(err);
              resolve(txHash);
            }
          );
        })
    );
  }

  rejectExchangeContract({exchange, user}) {
    return this.getExchangeContract(exchange.bcContractAddress).then(
      contract =>
        new Promise((resolve, reject) => {
          contract.reject({from: user.bcDefaultAccountAddress}, (err, txHash) => {
            if (err) return reject(err);
            resolve(txHash);
          });
        })
    );
  }

  provideExchangeContractFeedback(feedback, {exchange, user}) {
    const method =
      user.id === exchange.initiator.id ? 'givePartnerItemFeedback' : 'giveInitiatorItemFeedback';

    return this.getExchangeContract(exchange.bcContractAddress).then(
      contract =>
        new Promise((resolve, reject) => {
          contract[method](feedback, {from: user.bcDefaultAccountAddress}, (err, txHash) => {
            if (err) return reject(err);
            resolve(txHash);
          });
        })
    );
  }

  validateExchangeContract({exchange, user}) {
    return this.provideExchangeContractFeedback(true, {exchange, user});
  }

  reportExchangeContract({exchange, user}) {
    return this.provideExchangeContractFeedback(false, {exchange, user});
  }
}

const metamaskService = new MetaMask();

export default metamaskService;
