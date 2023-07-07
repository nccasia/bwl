/* eslint-disable prettier/prettier */
import axios from 'axios';
import {showToast}  from "../util/showToast";

export const getNotification = async (index, dispatch) => {
    try {
        dispatch({type: "CHANGE_LOADING_NOTIFICATION", payload: true});
        const res = await axios({
            url: `/api/notifications?messageId=${index?.messageId}&page=${index?.page}`,
            method: "GET",
          });
        dispatch({type:"CHANGE_NOTIFICATION_ALL", payload:  {list:res.data?.notifications, page: index?.page}})
    } catch(error) {
        dispatch({type:"CHANGE_LOADING_NOTIFICATION", payload: true});
        showToast("error", error?.response?.data?.message);
        return [];
    }
}

export const getNotificationSize = async (index, dispatch) => {
    try {
        const res = await axios({
            url: `/api/notifications/size?messageId=${index}`,
            method: "GET",
          });
        dispatch({type: "SET_LENGTH_NOTIFICATION", payload: res.data})
        return res.data;
    } catch (error) {
        showToast("error", error?.response?.data?.message);
        return [];
    }
}

export const postNotification = async (messageId) => {
    try {
        await axios({
            url: "/api/notifications/size",
            data: {
                messageId: messageId,
            },
            method: "POST",
        });
    } catch (error) {
        showToast("error", error?.response?.data?.message);
        return {};
    }
}
