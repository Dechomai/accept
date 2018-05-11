/* global web3: false */

class MetaMask {
  isPluginInstalled() {
    return new Promise((resolve, reject) => {
      if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) return resolve();
      reject();
    });
  }

  isAcceptNetwork() {
    return new Promise((resolve, reject) => {
      this.isPluginInstalled().then(
        () => {
          web3.version.getNetwork((err, networkId) => {
            if (err) return reject(err);
            if (networkId !== 1011) return reject('Wrong network');
            resolve();
          });
        },
        () => reject()
      );
    });
  }

  getActiveAccount() {
    return new Promise((resolve, reject) => {
      this.isPluginInstalled().then(
        () => {
          web3.eth.getAccounts((err, accounts) => {
            if (err) return reject(err);
            if (!accounts.length) return reject('No active account');
            resolve(accounts[0]);
          });
        },
        () => reject()
      );
    });
  }
}

const metamaskService = new MetaMask();

export default metamaskService;
