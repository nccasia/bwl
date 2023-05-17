import axios from 'axios';

export const getAll = async (index) => {
  try {
    const res = await axios({
      url: `/api/getAllPaging?page=${index}`,
      method: 'GET',
    });
    return res.data;
  } catch {
    return [];
  }
};
