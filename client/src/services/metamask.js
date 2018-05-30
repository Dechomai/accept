import Web3 from 'web3';

import config from '../config';
import exchangeContractData from '../config/contracts/exchange';
import tokenContractData from '../config/contracts/token';

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
              if (networkId !== '1011') return reject('Wrong network');
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
      .then(() => Promise.all([this.getActiveAccount(), this.getWeb3()]))
      .then(([address, web3]) => {
        const value = web3.toWei(price, 'ether');

        const tokenContract = web3.eth
          .contract(tokenContractData.abi)
          .at(config.bcTokenContractAddress);

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
    const value = web3.toWei(exchange.price, 'ether');
    return this.getExchangeContract(exchange.bcContractAddress).then(
      contract =>
        new Promise((resolve, reject) => {
          contract.accept(
            {
              from: user.bcDefaultAccountAddress,
              value
            },
            (err, txHash) => {
              if (err) return reject(err);
              resolve(txHash);
            }
          );
        })
    );
  }
}

const metamaskService = new MetaMask();

export default metamaskService;
