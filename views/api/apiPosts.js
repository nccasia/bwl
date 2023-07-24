/* eslint-disable prettier/prettier */
import axios from 'axios';
import {showToast}  from "../util/showToast";

export const getAll = async (index, dispatch) => {
    try {
        dispatch({type:"CHANGE_LOADING_POST", payload: true});
        const res = await axios({
            url: index.messageId ? `/api/getAllPaging?page=${index.page}&size=${index.size}&messageId=${index.messageId}&channel=${index.channel}` : `/api/getAllPaging?page=${index.page}&size=${index.size}&channel=${index.channel}`,
            method: "GET",
          });
        dispatch({type:"SET_POSTS", payload: res.data})
    } catch(error) {
        dispatch({type:"CHANGE_LOADING_POST", payload: false});
        showToast("error", error?.response?.data?.message);
        return [];
    }
}

export const getOne = async (index, dispatch) => {
    try {
        dispatch({type:"CHANGE_LOADING_POST", payload: true});
        const res = await axios({
            url: index.id ? `/api/posts?messageId=${index.messageId}&id=${index.id}` : `/api/posts?messageId=${index.messageId}`,
            method: "GET",
          });
        dispatch({type:"SET_POSTS", payload: res.data})
    } catch(error) {
        dispatch({type:"CHANGE_LOADING_POST", payload: false});
        showToast("error", error?.response?.data?.message);
        return [];
    }
}

export const getHotPosts = async (index, dispatch) => {
    try {
        dispatch({type:"CHANGE_LOADING_POST", payload: true})
        const res = await axios({
            url: `/api/hotposts?page=${index?.page}&size=${index?.size}&messageId=${index?.messageId}&channel=${index.channel}`,
            method: "GET",
          });
        dispatch({type:"SET_POSTS", payload: res.data})
    } catch(error) {
        dispatch({type:"CHANGE_LOADING_POST", payload: false});
        showToast("error", error?.response?.data?.message);
        return [];
    }
}

export const deletePost = async (index) => {
    try {
        const res = await axios({
            url: `/api/posts?id=${index.id}&messageId=${index.messageId}`,
            method: "DELETE",
          });
        return res.data;
    } catch (error) {
        showToast("error", error?.response?.data?.message);
        return false;
    }
}

export const addPost = async (index) => {
    try {
        const res = await axios({
            url: `/api/upload?id=${index.id}&channelId=${index.channelId}`,
            method: "POST",
            data: index?.formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
          });
        return res.data;
    } catch (error) {
        showToast("error", error?.response?.data?.message);
        return false;
    }
}

export const editPost = async (index) => {
    try {
        const res = await axios({
            url: `/api/edit/post?id=${index.id}&messageId=${index.messageId}`,
            method: "POST",
            data: index?.formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
          });
        return res.data;
    } catch (error) {
        showToast("error", error?.response?.data?.message);
        return false;
    }
}

export const getSearchPost = async (index, dispatch) => {
    try {
        dispatch({type:"CHANGE_LOADING_USERS", payload: true});
        const res = await axios({
            url: `api/search/posts?page=${index?.page}&messageId=${index?.messageId}&channelId=${index?.channelId}`,
            method: "GET",
          });
        dispatch({type:"SET_SEARCH_POSTS", payload: res.data})
    } catch(error) {
        dispatch({type:"CHANGE_LOADING_USERS", payload: false});
        showToast("error", error?.response?.data?.message);
        return [];
    }
}

export const getSearchTimePost = async (index, dispatch) => {
    try {
        dispatch({type:"CHANGE_LOADING_USERS", payload: true});
        const res = await axios({
            url: `api/search/time/posts?page=${index?.page}&start=${index?.start}&end=${index?.end}&channelId=${index?.channelId}`,
            method: "GET",
          });
        dispatch({type:"SET_SEARCH_POSTS", payload: res.data})
    } catch(error) {
        dispatch({type:"CHANGE_LOADING_USERS", payload: false});
        showToast("error", error?.response?.data?.message);
        return [];
    }
}

export const getChannel = async (dispatch) => {
    try {
      dispatch({type:"CHANGE_LOADING_USERS", payload: true});
      const res = await axios({
        url: "/api/channel",
        method: 'GET',
      });
      dispatch({type:"CHANGE_LOADING_USERS", payload: false});
      dispatch({type:"SET_CHANNEL_LIST", payload: res?.data?.channel});
    } catch(error){
      showToast("error", error?.response?.data?.message);
      dispatch({type:"CHANGE_LOADING_USERS", payload: false});
      return [];
    }
};
