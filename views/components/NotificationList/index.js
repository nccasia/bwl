/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import {changeTime}  from '../../util/changeTime';
import { useNavigate } from "react-router-dom";
import {useStore} from "../../store";
import CircularProgress from '@mui/material/CircularProgress';

const NotificationList = (props) => {
  const {state, dispatch}=useStore();
  const navigate = useNavigate();
  const handleChangePage = async (index) => {
    await dispatch({type: "SET_POSTS_NULL"});
    navigate(`/posts?messageId=${index}`);
  }

  return (
    <div>
      {state.notification ? state.notification.map((main, index) => {
        return (
          <div 
            key={index}
            onClick={() => handleChangePage(main?.messageId)}
            className="notification-list"
          >
            {main.content ? (
                <div className="list-notifi">
                  <img 
                    className="list-notifi-image"
                    src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`} 
                    alt="avatar" 
                  />
                  <span>
                    <p>
                      <b style={{ color: state.background ? "#c0c0cd" : "black"}}>{main?.author[0]?.username}</b>
                      {" đã bình luận bài viết của bạn có nội dung:"}
                    </p>
                    <p>{main?.content}</p>
                    <p className="time-notifi">{changeTime(main?.createdTimestamp)}</p>
                  </span>
                  <img src={`https://bwl.vn/images/${main?.message[0]?.links[0]}`}  width="50px" height="50px"/>
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
                      <b style={{ color: state.background ? "#c0c0cd" : "black"}}>{main?.author[0]?.username} </b>
                      {main?.onLike ? " đã thích bài viết của bạn." : " đã bỏ thích bài viết của bạn."}
                    </p>
                    <p className="time-notifi">{changeTime(main?.createdTimestamp)}</p>
                  </span>
                  <img src={`https://bwl.vn/images/${main?.message[0]?.links[0]}`}  width="50px" height="50px"/>
                </div>
              )
            }
            {main?.onLabel && <p className="new-notifi">New</p>}
          </div>
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