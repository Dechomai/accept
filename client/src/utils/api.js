const STATUS_SUCCESSFULL = 200;

const API = '/api';
const getOptions = () => ({
  API
});
const getBody = (method, body) => (method === 'GET' ? {} : {body: JSON.stringify(body)});

const api = {
  fetch(method, url, {headers = {}, body, ...props} = {}, options = getOptions()) {
    return fetch(`${options.API}${url}`, {
      method,
      headers: {
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
        ...headers
      },
      credentials: 'same-origin',
      ...getBody(method, body),
      ...props
    })
      .then(res => {
        if (res.status !== STATUS_SUCCESSFULL) return Promise.reject(res);
        return res.json();
      })
      .catch(res => this.handleError(res));
  },
  handleError(err) {
    // TODO: handle error
    // especially 401 (but optionally)
    return Promise.reject(err);
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
  }
};

export default api;
