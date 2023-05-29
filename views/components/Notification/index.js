import React from 'react';
import './style.scss';
import { postNotification } from '../../api/apiNotification';
import { useStore } from '../../store';
import NotificationList from '../NotificationList';

const Notification = (props) => {
  const { state, dispatch } = useStore();
  const spanRef = React.useRef(null);
  React.useEffect(() => {
    const scrollElement = spanRef.current;
    const handleScroll = () => {
      if (
        scrollElement.scrollTop + scrollElement.clientHeight >=
        scrollElement.scrollHeight - 10
      ) {
        dispatch({ type: 'CHANGE_PAGE_NOTIFICATION' });
      }
    };
    scrollElement.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      scrollElement.addEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOutsideClick = async (event) => {
    if (spanRef.current && !spanRef.current.contains(event.target)) {
      await props?.setOpen(false);
      await props?.setLabel(false);
      if (state.author?.id) {
        postNotification(state.author?.id, dispatch);
      }
    }
  };
  return (
    <div className="container" ref={spanRef}>
      <h1 className="title-notifi">
        <b>Thông báo</b>
      </h1>
      <NotificationList />
    </div>
  );
};
export default Notification;
