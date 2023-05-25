import React from 'react';
import './style.scss';
import {changeTime}  from '../../util/changeTime';
import { Link } from "react-router-dom";
import {getNotification} from '../../api/apiNotification';
import {useStore} from "../../store";
import CircularProgress from '@mui/material/CircularProgress';

const NotificationList = (props) => {
  const {state, dispatch}=useStore();
  React.useEffect(() => {
    if(state.author?.id && state.pageNotification > 0) {
      getNotification({messageId: state.author.id, page: state.pageNotification}, dispatch)
    }
  }, [state.pageNotification]);

  return (
    <div>
      {state.notification ? state.notification.map((main, index) => {
        return (
          <Link to={`/posts?messageId=${main?.messageId}`} key={index}>
            <div>
              {main.content ? (
                  <div className="list-notifi" style={{backgroundColor: main?.onLabel ? "gray": "white"}}>
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
      {state.loadingNotifi && (
        <div className="notifi-progress">
          <CircularProgress/>
        </div>
      )}
    </div>
  );
};
export default NotificationList;