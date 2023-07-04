/* eslint-disable prettier/prettier */
import axios from 'axios';
import {showToast}  from "../util/showToast";

export const getComment = async (index, dispatch) => {
  try {
    const res = await axios({
      url: `/api/comments?page=${index?.page}&size=${index?.size}&messageId=${index?.messageId}&id=${index?.id}`,
      method: 'GET',
    });
    dispatch({
      type: "SET_COMMENTS", 
      payload: {
        list: res.data?.comments, 
        size:res.data?.size, 
        messageId: index?.messageId, 
        page: index?.page, 
        type: index?.type
      }
    });
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

export const postCommentItem = async (index) => {
    try {
        const res = await axios({
            url: "/api/comment",
            data: index,
            method: "POST",
        });
        return res.data;
    } catch(error) {
      showToast("error", error?.response?.data?.message);
      return {};
    }
}

export const getCommentItem = async (id,commentId, page, size, dispatch, messageId, type) => {
    try {
      const res = await axios({
        url: `/api/comment/item?page=${page}&size=${size}&id=${id}&messageId=${messageId}&commentId=${commentId}`,
        method: 'GET',
      });
      dispatch({
        type: "SET_COMMENTS_ITEM", 
        payload: {
          list: res.data?.item, 
          size: res.data?.size, 
          id: commentId, 
          messageId: messageId, 
          page: page, 
          type: type
        }
      });
    } catch(error) {
      showToast("error", error?.response?.data?.message);
      return [];
    }
  };

export const postCommentLike = async (index) => {
    try {
        const res = await axios({
            url: "/api/comment/like",
            data: index,
            method: "POST",
        });
        return res.data;
    } catch(error) {
      showToast("error", error?.response?.data?.message);
      return {};
    }
}
