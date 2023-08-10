/* eslint-disable prettier/prettier */
import axios from 'axios';
import { showToast } from '../util/showToast';

export const getReactions = async (index) => {
  try {
    const res = await axios({
      url: `/api/reactions?messageId=${index?.messageId}&emoji=${index?.emoji}&size=${index?.size}&page=${index?.page}`,
      method: 'GET',
    });
    return res.data;
  } catch (error) {
    showToast('error', error?.response?.data?.message);
    return [];
  }
};
