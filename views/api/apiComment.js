import axios from 'axios';

export const getComment = async (index) => {
    try {
        const res = await axios({
            url: `/api/comments?messageId=${index}`,
            method: "GET",
          });
        return res.data?.comments;
    } catch {
        return [];
    }
}

export const postComment = async (index) => {
    try {
        const res = await axios({
            url: "/api/comment",
            data: index,
            method: "POST",
        });
        return res.data;
    } catch {
        return {};
    }
}