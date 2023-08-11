/* eslint-disable prettier/prettier */
import axios from 'axios';

export const getUser = async (index, dispatch) => {
  try {
    const res = await axios({
      url: 'https://discord.com/api/users/@me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${index}`,
      },
    });
    dispatch({ type: 'SET_AUTHOR', payload: res?.data });
  } catch {
    showToast('error', 'discord.com not run');
    return [];
  }
};

export const getSearchUsers = async (name, page, channelId, dispatch) => {
  try {
    dispatch({ type: 'CHANGE_LOADING_USERS', payload: true });
    const res = await axios({
      url: `/api/search?name=${name}&page=${page}&channelId=${channelId}`,
      method: 'GET',
    });
    dispatch({
      type: 'SET_USERS',
      payload: { list: res?.data, onSearch: name },
    });
  } catch (error) {
    dispatch({ type: 'CHANGE_LOADING_USERS', payload: false });
    showToast('error', error?.response?.data?.message);
    return [];
  }
};
