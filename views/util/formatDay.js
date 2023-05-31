/* eslint-disable prettier/prettier */
import dayjs from 'dayjs';

export const formatDay = (time) => {
  const dayMoment = dayjs().format('DD');
  const monthMoment = dayjs().format('MM');
  const yearMoment = dayjs().format('YYYY');
  const day = dayjs(new Date(+time.toString())).format('DD');
  const month = dayjs(new Date(+time.toString())).format('MM');
  const year = dayjs(new Date(+time.toString())).format('YYYY');
  if (
    dayMoment - day == 0 &&
    monthMoment - month == 0 &&
    yearMoment - year == 0
  ) {
    return 'Today at ' + dayjs(new Date(+time.toString())).format('hh:mm A');
  } else if (
    dayMoment - day == 1 &&
    monthMoment - month == 0 &&
    yearMoment - year == 0
  ) {
    return (
      'Yesterday at ' + dayjs(new Date(+time.toString())).format('hh:mm A')
    );
  } else {
    return dayjs(+new Date(+time.toString())).format('DD/MM/YYYY hh:mm A');
  }
};
