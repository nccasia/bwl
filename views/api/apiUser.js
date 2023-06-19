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
    dispatch({type:"SET_AUTHOR", payload: res?.data})
  } catch {
    showToast("error", "discord.com not run");
    return [];
  }
};
