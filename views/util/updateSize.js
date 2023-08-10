/* eslint-disable prettier/prettier */

export const updateSize = (length) => {
    const count = length % 5;
    const changePage= Math.ceil(length/5);
    if(count===0){
        return {page: changePage + 1, size: 5}
    } else{
        return {page: changePage, size: 5-count}
    }
};
