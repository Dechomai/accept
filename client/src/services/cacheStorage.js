class CacheStorage {
  constructor(provider) {
    this.provider = provider;
  }

  setItem(key, value) {
    const str = JSON.stringify(value);
    return this.provider.setItem(key, str);
  }

  getItem(key) {
    const str = this.provider.getItem(key);
    return JSON.parse(str);
  }

  removeItem(...args) {
    return this.provider.removeItem(...args);
  }
}

const cacheStorage = new CacheStorage(sessionStorage);

export default cacheStorage;
