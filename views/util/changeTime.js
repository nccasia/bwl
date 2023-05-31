/* eslint-disable prettier/prettier */
import Moment from 'moment';

export const changeTime = (time) => {
    const timeNotifi = new Date - time;
    const seconds = Math.floor(timeNotifi / 1000);
    if (seconds < 60 && seconds > 0) {
      return String(seconds ) + " giây trước";
    } else {
      const minutes = Math.floor(seconds / 60);
      if(minutes < 60 && minutes > 0 ) {
        return String(minutes) + " phút trước";
      } else {
        const hours = Math.floor(minutes / 60);
        if(hours > 0 && hours < 24) {
          return String(hours) + " giờ trước";
        }else{
          const days = Math.floor(hours / 24);
          if(days > 0 && days < 10) {
            return String(days) + " ngày trước";
          }else{
            return String(Moment(Number(time)).format("DD/MM/YYYY hh:mm A"));
          }
        }
      }
    }
  }