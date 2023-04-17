/* eslint-disable prettier/prettier */
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://bwl.vn',
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

export default axiosClient;
