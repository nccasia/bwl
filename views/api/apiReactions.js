import axios from 'axios';

export const getReactions = async (index) => {
    try {
        const res = await axios({
            url: `/api/reactions?messageId=${index?.messageId}&emoji=${index?.emoji}`,
            method: "GET",
          });
        return res.data;
    } catch {
        return [];
    }
}