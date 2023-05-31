/* eslint-disable prettier/prettier */
import axios from 'axios';

export const getLogin = async () => {
  try {
    const res = await axios({
      url: '/api/login',
      method: 'GET',
    });
    return res.data?.url;
  } catch {
    return '';
  }
};

export const getLogout = async () => {
  try {
    await axios({
      url: '/api/logout',
      method: 'GET',
    });
  } catch {
    return '';
  }
};
