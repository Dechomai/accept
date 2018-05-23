import cacheStorage from './cacheStorage';

const CACHE_KEY = 'exchange_cache_v1';

const exchangeCache = {
  get() {
    return cacheStorage.getItem(CACHE_KEY);
  },
  set(val) {
    return cacheStorage.setItem(CACHE_KEY, val);
  },
  reset() {
    return cacheStorage.removeItem(CACHE_KEY);
  }
};

export default exchangeCache;
