const Web3 = require('web3');
const config = require('../../config');
const {createLoggerWith} = require('../logger');

const BLOCKCHAIN_ADDRESS = config.get('blockchain.address');

const logger = createLoggerWith('[SVC]:Blockchain');

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
              logger.error('Error retrieving block by txHash', transactionHash);
              return reject(err);
            }
            if (block && block.contractAddress) {
              logger.verbose(
                'Got contract address from txHash',
                block.contractAddress,
                transactionHash
              );
              return resolve(block.contractAddress);
            }
            logger.error(
              'Error retrieving contract address from block, block might not have been mined yet'
            );
            return reject(null);
          });
        })
    );
  }
}

const blockchainService = new BlockchainService();

module.exports = blockchainService;
