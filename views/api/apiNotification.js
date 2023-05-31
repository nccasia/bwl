/* eslint-disable prettier/prettier */
import axios from 'axios';
import React from 'react';

export const getNotification = async (index, dispatch) => {
    try {
        dispatch({type: "CHANGE_LOADING_NOTIFICATION"});
        const res = await axios({
            url: `/api/notifications?messageId=${index?.messageId}&page=${index?.page}`,
            method: "GET",
          });
        dispatch({type:"CHANGE_NOTIFICATION_ALL", payload: res.data?.notifications})
    } catch {
        return [];
    }
}

export const getNotificationSize = async (index, dispatch) => {
    try {
        const res = await axios({
            url: `/api/notifications/size?messageId=${index}`,
            method: "GET",
          });
        dispatch({type: "SET_LENGTH_NOTIFICATION", payload: res.data?.length})
        return res.data;
    } catch {
        return [];
    }
}

export const postNotification = async (messageId, dispatch) => {
    try {
        const res = await axios({
            url: "/api/notifications/size",
            data: {
                messageId: messageId,
            },
            method: "POST",
        });
        dispatch({type: "SET_NOTIFICATION"});
    } catch {
        return {};
    }
}
