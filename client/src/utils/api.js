const STATUS_SUCCESSFULL = 200;

const API = '/api';
const getOptions = () => ({
  API
});
const getBody = (method, body) => (method === 'GET' ? {} : {body: JSON.stringify(body)});

// export const MIN_LOADING_TIME = 2000;
// const waitFor = promise => {
//   const timeout = new Promise(resolve => {
//     setTimeout(resolve, MIN_LOADING_TIME);
//   });

//   return Promise.all([promise, timeout]).then(([arg]) => arg);
// };

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

  postForm(url, data) {
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
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    }).then(response => response.json());
  },
  putForm(url, data) {
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
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
      .then(res => (res.status === STATUS_SUCCESSFULL ? res.json() : Promise.reject(res)))
      .catch(res => this.handleError(res));
  }
};

export default api;
