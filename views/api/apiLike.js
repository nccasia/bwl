/* eslint-disable prettier/prettier */
import axios from 'axios';
import {showToast}  from "../util/showToast";

export const getLikes = async (index) => {
    try {
        const res = await axios({
            url: `/api/likes?messageId=${index.messageId}&size=${index.size}&page=${index.page}`,
            method: "GET",
          });
        return res.data;
    } catch(error) {
      showToast("error", error?.response?.data?.message);
      return [];
    }
}

export const postLike = async (messageId, authorId) => {
  try {
    const res = await axios({
      url: '/api/like',
      data: {
        messageId: messageId,
        authorId: authorId,
      },
      method: 'POST',
    });
    return res.data;
  } catch (error){
    showToast("error", error?.response?.data?.message);
    return {};
  }
};
