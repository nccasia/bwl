import axios from 'axios';

export const getUser = async (index) => {
    try {
        const res = await axios({
            url: "https://discord.com/api/users/@me",
            method: "GET",
            headers: {
                Authorization: `Bearer ${index}`,
            },
          });
        return res.data;
    } catch {
        return [];
    }
}