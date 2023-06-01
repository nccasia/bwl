/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import {postNotification } from '../../api/apiNotification';
import {useStore} from "../../store";
import NotificationList  from "../NotificationList";
import {useDataDebouncer} from '../../util/useDebounce';
import {getNotification} from '../../api/apiNotification';

const Notification = (props) => {
  const { state, dispatch } = useStore();
  const spanRef = React.useRef(null);
  const debounce = useDataDebouncer(state.pageNotification, 500)
  React.useEffect(() => {
    const scrollElement = spanRef.current;
    const handleScroll = () => {
      if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 10 && state.lengthNotication !== -1) {
        dispatch({type: "CHANGE_PAGE_NOTIFICATION", payload: debounce});
      }
    };
    scrollElement.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleOutsideClick);
    if(state.author?.id && state.pageNotification > 0) {
      getNotification({messageId: state.author.id, page: debounce}, dispatch)
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      scrollElement.addEventListener('scroll', handleScroll);
    };
  }, [debounce]);

  const handleOutsideClick = async (event) => {
    if (spanRef.current && !spanRef.current.contains(event.target)) {
      await props?.setOpenNotification(false);
      if (state.author?.id) {
        postNotification(state.author?.id, dispatch);
      }
    }
  };
  return (
    <div 
      className="container" 
      ref={spanRef}
      style={{ backgroundColor: state.background ? "#242526": "white", color: "#6C7588"}}
    >
      <h1 className="title-notifi"><b>Thông báo</b></h1>
      <NotificationList />
    </div>
  );
};
export default Notification;
