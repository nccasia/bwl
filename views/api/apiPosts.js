import axios from 'axios';

export const getAll = async (index, dispatch) => {
    try {
        dispatch({type:"CHANGE_LOADING_POST"})
        const res = await axios({
            url: `/api/getAllPaging?page=${index}`,
            method: "GET",
          });
        dispatch({type:"SET_POSTS", payload: res.data})
    } catch {
        return [];
    }
}

export const getOne = async (index) => {
    try {
        const res = await axios({
            url: `/api/posts?messageId=${index}`,
            method: "GET",
          });
        return res.data;
    } catch {
        return [];
    }
}
