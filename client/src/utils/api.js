const STATUS_SUCCESSFULL = 200;

const API = '/api';
const getOptions = () => ({
  API,
  handleUnauthorizedError: true
});
const getBody = (method, body) => (method === 'GET' ? {} : {body: JSON.stringify(body)});

// use 1 second delay in dev mode
const MIN_LOADING_TIME = ENV === 'develop' ? 1000 : 0;

const waitFor = promise => {
  const timeout = new Promise(resolve => {
    setTimeout(resolve, MIN_LOADING_TIME);
  });

  return Promise.all([promise, timeout]).then(([arg]) => arg);
};

const api = {
  fetch(method, url, {headers = {}, body, ...props} = {}, options = {}) {
    const opts = {...getOptions(), ...options};
    return waitFor(
      fetch(`${opts.API}${url}`, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers
        },
        credentials: 'same-origin',
        cache: 'no-cache',
        ...getBody(method, body),
        ...props
      })
    )
      .then(res => (res.status === STATUS_SUCCESSFULL ? res.json() : Promise.reject(res)))
      .catch(res => this.handleError(res, opts));
  },
  handleError(res, options) {
    const code = res.status;
    if (code === 401 && options.handleUnauthorizedError) {
      window.location.replace('/');
    }

    return res.json().then(err => Promise.reject({code, ...err}));
  },

  get(...args) {
    return this.fetch('GET', ...args);
  },

  post(...args) {
    return this.fetch('POST', ...args);
  },

  put(...args) {
    return this.fetch('PUT', ...args);
  },

  delete(...args) {
    return this.fetch('DELETE', ...args);
  },

  fetchForm(method, url, data) {
    let formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    });

    const options = getOptions();

    return fetch(options.API + url, {
      method,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
      .then(res => (res.status === STATUS_SUCCESSFULL ? res.json() : Promise.reject(res)))
      .catch(res => this.handleError(res));
  },

  postForm(...args) {
    return this.fetchForm('POST', ...args);
  },

  putForm(...args) {
    return this.fetchForm('PUT', ...args);
  }
};

export default api;
