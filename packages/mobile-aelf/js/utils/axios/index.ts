import axios from 'axios';

const instance = axios.create({
  baseURL: '',
  timeout: 4000,
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;
