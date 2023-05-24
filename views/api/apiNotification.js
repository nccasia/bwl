import axios from 'axios';

export const getNotification = async (index) => {
    try {
        const res = await axios({
            url: `/api/notifications?messageId=${index?.messageId}&onLabel=${index?.onLabel}`,
            method: "GET",
          });
        return res.data;
    } catch {
        return [];
    }
}

export const getNotificationSize = async (index) => {
    try {
        const res = await axios({
            url: `/api/notifications/size?messageId=${index}`,
            method: "GET",
          });
        return res.data;
    } catch {
        return [];
    }
}

export const postNotification = async (messageId) => {
    try {
        const res = await axios({
            url: "/api/notifications/size",
            data: {
                messageId: messageId,
            },
            method: "POST",
        });
        return res.data;
    } catch {
        return {};
    }
}