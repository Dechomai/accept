const fetch = require('node-fetch');
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');

const config = require('../../config');
const tokenContractData = require('../../config/contracts/token');
const {createLoggerWith} = require('../logger');

const BLOCKCHAIN_HTTP_ADDRESS = config.get('blockchain.httpAddress');
const BLOCKCHAIN_WS_ADDRESS = config.get('blockchain.wsAddress');

const TOKEN_CONTRACT_ADDRESS = config.get('blockchain.tokenContractAddress');
const TOKEN_SPONSOR_ADDRESS = config.get('blockchain.tokenSponsorAddress');
const TOKEN_SPONSOR_PRIVATE_KEY = config.get('blockchain.tokenSponsorPrivateKey');

const logger = createLoggerWith('[SVC:Blockchain]');

class BlockchainService {
  constructor() {
    this.httpWeb3 = null;
    this.wsWeb3 = null;
  }

  // type = http | ws
  getWeb3(type = 'http') {
    if (type === 'http') {
      if (this.httpWeb3) return Promise.resolve(this.httpWeb3);
      this.httpWeb3 = new Web3(BLOCKCHAIN_HTTP_ADDRESS);
      return Promise.resolve(this.httpWeb3);
    }
    if (type === 'ws') {
      if (this.wsWeb3) return Promise.resolve(this.wsWeb3);
      this.wsWeb3 = new Web3(BLOCKCHAIN_WS_ADDRESS);
      return Promise.resolve(this.wsWeb3);
    }
    return Promise.reject('Invalid type argument provided');
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
    return this.getWeb3()
      .then(web3 =>
        Promise.all([web3, web3.eth.getTransactionCount(TOKEN_SPONSOR_ADDRESS, 'pending')])
      )
      .then(([web3, nonce]) => {
        const initialBalance = '20000000000000000000'; // 20 ether

        const tokenContract = new web3.eth.Contract(tokenContractData.abi, TOKEN_CONTRACT_ADDRESS);
        const data = tokenContract.methods.transfer(userAddress, initialBalance).encodeABI();

        const tokenTxParameters = {
          nonce,
          gasPrice: 21000,
          gasLimit: web3.utils.toHex(200000),
          to: TOKEN_CONTRACT_ADDRESS,
          data
        };

        return this.sendSignedTransaction(tokenTxParameters).then(
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
        web3.eth.sendSignedTransaction(signedTx, (err, txHash) => {
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
    return this.getWeb3('ws').then(web3 => {
      return new web3.eth.Contract(tokenContractData.abi, TOKEN_CONTRACT_ADDRESS).events
        .ExchangeInitiated;
    });
  }

  sendBonusEther(address) {
    return fetch(`http://faucet.ropsten.be:3001/donate/${address}`)
      .then(res => res.json())
      .then(
        res => {
          logger.info(':sendBonusEther', 'sent bonus ether', res);
          return res;
        },
        err => {
          logger.error(':sendBonusEther', 'error sending bonus ether', err);
          return err;
        }
      );
  }
}

const blockchainService = new BlockchainService();

module.exports = blockchainService;
