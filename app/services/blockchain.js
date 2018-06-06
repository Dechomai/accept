const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');

const config = require('../../config');
const tokenContract = require('../../config/contracts/token');
const {createLoggerWith} = require('../logger');

const BLOCKCHAIN_ADDRESS = config.get('blockchain.address');

const TOKEN_CONTRACT_ADDRESS = config.get('blockchain.tokenContractAddress');
const TOKEN_SPONSOR_ADDRESS = config.get('blockchain.tokenSponsorAddress');
const TOKEN_SPONSOR_PRIVATE_KEY = config.get('blockchain.tokenSponsorPrivateKey');

const logger = createLoggerWith('[SVC:Blockchain]');

class BlockchainService {
  constructor() {
    this.web3 = null;
  }

  getWeb3() {
    if (this.web3) return Promise.resolve(this.web3);
    this.web3 = new Web3(new Web3.providers.HttpProvider(BLOCKCHAIN_ADDRESS));
    return Promise.resolve(this.web3);
  }

  getContractAddress(transactionHash) {
    return this.getWeb3().then(
      web3 =>
        new Promise((resolve, reject) => {
          web3.eth.getTransactionReceipt(transactionHash, (err, block) => {
            if (err) {
              logger.error(
                ':getContractAddress',
                'Error retrieving block by txHash',
                transactionHash
              );
              return reject(err);
            }
            if (!block) {
              logger.error(':getContractAddress', 'Block not mined yet', transactionHash);
              return reject('Block not mined yet');
            }
            if (block && block.logs && !block.logs.length) {
              logger.error(':getContractAddress', 'Transaction did not succeed', transactionHash);
              return reject('Transaction did not succeed');
            }

            const contractAddress = block.logs
              .map(log => log.address)
              .find(address => address !== TOKEN_CONTRACT_ADDRESS);

            if (contractAddress) {
              logger.info(
                ':getContractAddress',
                'Got contract address:',
                contractAddress,
                'from txHash',
                transactionHash
              );
              return resolve(contractAddress);
            }
            logger.error(
              ':getContractAddress',
              'Error retrieving contract address from block, block might not have been mined yet'
            );
            return reject(null);
          });
        })
    );
  }

  getTransaction(transactionHash) {
    return this.getWeb3().then(
      web3 =>
        new Promise((resolve, reject) => {
          web3.eth.getTransactionReceipt(transactionHash, (err, transactionReceipt) => {
            if (err) {
              logger.error(':getTransaction', 'Error retrieving block by txHash', transactionHash);
              return reject(err);
            }
            if (transactionReceipt === null) {
              logger.error(
                ':getTransaction',
                'Error retrieving transaction receipt, block might not have been mined yet'
              );
              return reject(null);
            }
            return resolve(transactionReceipt);
          });
        })
    );
  }

  sendUserBonus(userAddress) {
    return this.getWeb3().then(web3 => {
      const initialBalance = 20000000000000000000; // 20 ether

      const nonce = web3.eth.getTransactionCount(TOKEN_SPONSOR_ADDRESS, 'pending');
      const etherTxParameters = {
        nonce: nonce,
        gasPrice: '0x5208',
        gasLimit: '0x30D40',
        to: userAddress,
        value: initialBalance
      };

      let txData = web3.eth
        .contract(tokenContract.abi)
        .at(TOKEN_CONTRACT_ADDRESS)
        .transfer.getData(userAddress, initialBalance);

      const tokenTxParameters = {
        nonce: nonce + 1,
        gasPrice: '0x5208',
        gasLimit: '0x30D40',
        to: TOKEN_CONTRACT_ADDRESS,
        data: txData
      };

      return this.sendSignedTransaction(etherTxParameters)
        .then(
          txHash => {
            logger.info(':sendUserBonus', 'Sent bonus ether to:', userAddress, 'txHash:', txHash);
            return this.sendSignedTransaction(tokenTxParameters);
          },
          err => {
            logger.error(':sendUserBonus', 'Error sending bonus ether to:', userAddress, err);
            return Promise.reject(err);
          }
        )
        .then(
          txHash => {
            logger.info(':sendUserBonus', 'Sent bonus tokens to:', userAddress, 'txHash:', txHash);
          },
          err => {
            logger.error(':sendUserBonus', 'Error sending bonus tokens to:', userAddress, err);
            return Promise.reject(err);
          }
        );
    });
  }

  sendSignedTransaction(rawTx) {
    return this.getWeb3().then(web3 => {
      const privateKey = Buffer.from(TOKEN_SPONSOR_PRIVATE_KEY, 'hex');

      const tx = new EthereumTx(rawTx);
      tx.sign(privateKey);
      const signedTx = '0x' + tx.serialize().toString('hex');

      return new Promise((resolve, reject) => {
        web3.eth.sendRawTransaction(signedTx, (err, txHash) => {
          if (err) {
            logger.error(':sendSignedTransaction', 'Error sending signed transaction', err);
            return reject(err);
          }
          logger.info(':sendSignedTransaction', 'Signed transaction sent', txHash);
          resolve(txHash);
        });
      });
    });
  }

  getExchangeInitiatedEvent() {
    return this.getWeb3().then(web3 =>
      web3.eth
        .contract(tokenContract.abi)
        .at(TOKEN_CONTRACT_ADDRESS)
        .ExchangeInitiated()
    );
  }
}

const blockchainService = new BlockchainService();

module.exports = blockchainService;
