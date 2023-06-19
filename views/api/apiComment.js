/* eslint-disable prettier/prettier */
import axios from 'axios';
import {showToast}  from "../util/showToast";

export const getComment = async (index) => {
  try {
    const res = await axios({
      url: `/api/comments?messageId=${index?.messageId}&page=${index?.page}`,
      method: 'GET',
    });
    return res.data?.comments;
  } catch(error) {
    showToast("error", error?.response?.data?.message);
    return [];
  }
};

export const postComment = async (index) => {
    try {
        const res = await axios({
            url: "/api/comment",
            data: index,
            method: "POST",
        });
        return res.data;
    } catch(error) {
        return {};
    }
}

export const deleteComment = async (index) => {
    try {
        const res = await axios({
            url: `/api/comments?id=${index.id}&messageId=${index.messageId}`,
            method: "DELETE",
          });
        return res.data;
    } catch (error){
        showToast("error", error?.response?.data?.message);
        return false;
    }
}

export const editComment = async (index) => {
    try {
        const res = await axios({
            url: "/api/comment/edit",
            data: index,
            method: "POST",
        });
        return res.data;
    } catch (error){
        showToast("error", error?.response?.data?.message);
        return {};
    }
}
