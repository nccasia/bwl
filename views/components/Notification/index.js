import React from 'react';
import './style.scss';
import {changeTime}  from '../../util/changeTime';

const Notifycation = (props) => {
  //console.log(props.notifications);
  return (
    <div className="container">
      <h1 className="title-notifi"><b>Thông báo</b></h1>
      {props.notifications ? props.notifications.map((main, index) => {
        return (
          <div key={index}>
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
                      {" đã thích bài viết của bạn."}
                    </p>
                    <p className="time-notifi">{changeTime(main?.message[0]?.createdTimestamp.$numberDecimal)}</p>
                  </span>
                </div>
              )
            }
          </div>
        )
      }): null}
    </div>
  );
};
export default Notifycation;
