import axios from 'axios';

export const getLikes = async (index) => {
    try {
        const res = await axios({
            url: `/api/likes?messageId=${index}`,
            method: "GET",
          });
        return res.data;
    } catch {
        return [];
    }
}

export const postLike = async (messageId, authorId) => {
    try {
        const res = await axios({
            url: "/api/like",
            data: {
                messageId: messageId,
                authorId: authorId,
            },
            method: "POST",
        });
        return res.data;
    } catch {
        return {};
    }
}