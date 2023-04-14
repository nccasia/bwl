/* eslint-disable prettier/prettier */
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

export default axiosClient;
