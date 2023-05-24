import axios from 'axios';

export const getNotification = async (index) => {
  try {
    const res = await axios({
      url: `/api/notifications?messageId=${index}`,
      method: 'GET',
    });
    return res.data?.notifications;
  } catch {
    return [];
  }
};
