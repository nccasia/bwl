/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import {useStore} from "../../store";
import NotificationList  from "../NotificationList";
import {useDataDebouncer} from '../../util/useDebounce';

const Notification = (props) => {
  const { state, dispatch } = useStore();
  const spanRef = React.useRef(null);
  React.useEffect(() => {
    const scrollElement = spanRef.current;
    const handleScroll = () => {
      if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 10 ) {
        if(!state.loadingNotifi && state.pageNotification !== -1){
          useDataDebouncer(dispatch({type: "CHANGE_PAGE_NOTIFICATION", payload: state.pageNotification + 1 }), 500)
        }
      }
    };
    scrollElement.addEventListener('scroll', handleScroll);
  }, [state.pageNotification, state.loadingNotifi]);

  return (
    <div 
      className="container" 
      ref={spanRef}
      style={{ backgroundColor: state.background ? "#242526": "white", color: "#6C7588"}}
    >
      <h1 className="title-notifi"><b>Thông báo</b></h1>
      <NotificationList openNotification={props?.openNotification}/>
    </div>
  );
};
export default Notification;
