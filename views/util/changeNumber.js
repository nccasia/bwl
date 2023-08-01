/* eslint-disable prettier/prettier */

export const changeNumber = (num) => {
    if (num >= 1e9) {
        const changetoNumber = (num / 1e9).toFixed(1);
        return `${changetoNumber}B`;
      } else if (num >= 1e6) {
        const changetoNumber = (num / 1e6).toFixed(1);
        return `${changetoNumber}M`;
      } else if (num >= 1e3) {
        const changetoNumber = (num / 1e3).toFixed(1);
        return `${changetoNumber}K`;
      } else {
        return num;
      }

}