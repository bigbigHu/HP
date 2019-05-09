import axios from 'axios';
import { merge } from 'lodash';
import store from '../../index';
import Nprogress  from 'nprogress';
import 'nprogress/nprogress.css';

// parent showSpinner
Nprogress.configure({
  showSpinner: false,
});
let requestingCount = 0;
function query (config) {
  const instance = axios.create(merge({
    baseURL: '',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }, config));

  instance.interceptors.request.use((request) => {
    Nprogress.start();
    if (requestingCount <= 0) {
      store.dispatch({ type: '@@DVA_LOADING/SHOW' });
      requestingCount = 0;
    }
    requestingCount += 1;
    return request;
  });
  instance.interceptors.response.use((response) => {
    Nprogress.done();
    if (requestingCount > 0) {
      store.dispatch({ type: '@@DVA_LOADING/HIDE' });
      requestingCount -= 1;
    }
    return response.data;
  });

  return instance;
}

function fetch (url, data, options = {}) {
  const {
    method = 'post', opts = {},
  } = options;
  const xhr = query(opts);
  switch (method.toLowerCase()) {
    case 'get':
    case 'delete':
      return xhr[method](url, {
        params: data,
      });
    case 'post':
    case 'put':
      return xhr[method](url, data);
    default:
      return axios({ url, method, opts });
  }
}

fetch.get = (url, data) => {
  return fetch(url, data, {
    method: 'get',
  });
};

fetch.delete = (url, data) => {
  return fetch(url, data, {
    method: 'get',
  });
};

fetch.post = (url, data) => {
  return fetch(url, data, {
    method: 'post',
  });
};
fetch.put = (url, data) => {
  return fetch(url, data, {
    method: 'post',
  });
};

export default fetch;

