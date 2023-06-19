/* eslint-disable prettier/prettier */
import axios from 'axios';
import {showToast}  from "../util/showToast";

export const getLogin = async () => {
  try {
    const res = await axios({
      url: '/api/login',
      method: 'GET',
    });
    return res.data?.url;
  } catch (error) {
    showToast("error", error?.response?.data?.message);
    return '';
  }
};

export const getLogout = async () => {
  try {
    await axios({
      url: '/api/logout',
      method: 'GET',
    });
  } catch (error) {
    showToast("error", error?.response?.data?.message);
    return '';
  }
};
