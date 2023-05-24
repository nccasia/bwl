import React from 'react';
import './style.scss';
import {changeTime}  from '../../util/changeTime';
import { Link } from "react-router-dom";
import {getNotification, postNotification } from '../../api/apiNotification';
import {useStore} from "../../store";

const Notification = (props) => {
  const {state, dispatch}=useStore();
  const handleNotificationAll = async () =>{
    if(state.author?.id) {
      await getNotification({messageId: state.author.id, onLabel: false}).then(data => {
        dispatch({type:"CHANGE_NOTIFICATION_ALL", payload: data?.notifications})
      })
    }
  }

  const spanRef = React.useRef(null);
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = async (event) => {
    if (spanRef.current && !spanRef.current.contains(event.target)) {
      await props?.setOpen(false);
      await props?.setLabel(false);
      if(state.author?.id) {
        postNotification(state.author?.id);
      }
    }
  };
  return (
    <div 
      className="container" 
      ref={spanRef}
    >
      <h1 className="title-notifi"><b>Thông báo</b></h1>
      {state.notification ? state.notification.map((main, index) => {
        return (
          <Link to={`/posts?messageId=${main?.messageId}`} key={index}>
            <div>
              {main.content ? (
                  <div className="list-notifi">
                    <img 
                      className="list-notifi-image"
                      src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`} 
                      alt="avatar" 
                    />
                    <span>
                      <p>
                        <b>{main?.author[0]?.username}</b>
                        {" đã bình luận bài viết của bạn có nội dung:"}
                      </p>
                      <p>{main?.content}</p>
                      <p className="time-notifi">{changeTime(main?.createdTimestamp)}</p>
                    </span>
                    
                  </div>
                )
              : (
                  <div className="list-notifi">
                    <img 
                      className="list-notifi-image"
                      alt="avatar"
                      src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`} 
                    />
                    <span>
                      <p>
                        <b>{main?.author[0]?.username} </b>
                        {main?.onLike ? " đã thích bài viết của bạn." : " đã bỏ thích bài viết của bạn."}
                      </p>
                      <p className="time-notifi">{changeTime(main?.createdTimestamp)}</p>
                    </span>
                  </div>
                )
              }
            </div>
          </Link>
        )
      }): null}
      <button 
        className="button-notifi"
        onClick={handleNotificationAll}
      >
        Tất cả
      </button>
    </div>
  );
};
export default Notification;
