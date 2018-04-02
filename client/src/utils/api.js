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
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
      },
      credentials: 'same-origin',
      ...getBody(method, body),
      ...props
    })
      .then(res => (res.status === STATUS_SUCCESSFULL ? res.json() : Promise.reject(res)))
      .catch(res => this.handleError(res));
  },
  handleError(err) {
    // TODO: handle error
    // especially 401 (but optionally)
    return err.json().then(err => Promise.reject(err));
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

  uploadFiles(url, files) {
    let formData = new FormData();

    Object.entries(files).forEach(([name, file]) => {
      formData.append(name, file);
    });

    const options = getOptions();
    return fetch(`${options.API}/media/upload${url}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    }).then(response => response.json());
  }
};

export default api;
