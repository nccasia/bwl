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
  React.useEffect(() => {
    const scrollElement = spanRef.current;
    const handleScroll = () => {
      if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 10 ) {
        if(!state.loadingNotifi && state.lengthNotication !== -1){
          useDataDebouncer(dispatch({type: "CHANGE_PAGE_NOTIFICATION", payload: state.pageNotification + 1 }), 500)
        }
      }
    };
    scrollElement.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleOutsideClick);
    if(state.author?.id && state.pageNotification > 0) {
      getNotification({messageId: state.author.id, page: state.pageNotification}, dispatch)
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      scrollElement.addEventListener('scroll', handleScroll);
    };
  }, [state.pageNotification]);

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
