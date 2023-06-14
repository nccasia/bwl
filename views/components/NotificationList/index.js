/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import { changeTime } from '../../util/changeTime';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import CircularProgress from '@mui/material/CircularProgress';

const NotificationList = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const handleChangePage = async (index) => {
    navigate(`/posts?messageId=${index}`);
  };

  return (
    <div>
      {state.notification
        ? state.notification.map((main, index) => {
            return (
              <div
                key={index}
                onClick={() => handleChangePage(main?.messageId)}
                className="notification-list"
              >
                {main?.onComment ? (
                  <div className="list-notifi">
                    <img
                      className="list-notifi-image"
                      src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`}
                      alt="avatar"
                    />
                    <span>
                      <p>
                        <b
                          style={{
                            color: state.background ? '#c0c0cd' : 'black',
                          }}
                        >
                          {main?.author[0]?.username}
                        </b>
                        {' đã' + main?.onComment +' bình luận bài viết của bạn có nội dung:'}
                      </p>
                      <p>{main?.content}</p>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                    <img 
                      src={main?.message[0]?.source ? `https://bwl.vn/assets/images/${main?.message[0]?.links[0]}` : `https://bwl.vn/images/${main?.message[0]?.links[0]}`} 
                      className="notifi-list-image"
                    />
                  </div>
                ) : (
                  <div className="list-notifi">
                    <img
                      className="list-notifi-image"
                      alt="avatar"
                      src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`}
                    />
                    <span>
                      <p>
                        <b
                          style={{
                            color: state.background ? '#c0c0cd' : 'black',
                          }}
                        >
                          {main?.author[0]?.username}{' '}
                        </b>
                        {main?.onLike
                          ? ' đã thích bài viết của bạn.'
                          : ' đã bỏ thích bài viết của bạn.'}
                      </p>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                    <img
                      src={main?.message[0]?.source ? `https://bwl.vn/assets/images/${main?.message[0]?.links[0]}` : `https://bwl.vn/images/${main?.message[0]?.links[0]}`}
                      className="notifi-list-image"
                    />
                  </div>
                )}
                {main?.onLabel && <p className="new-notifi">New</p>}
              </div>
            );
          })
        : null}
      {state.loadingNotifi && (
        <div className="notifi-progress">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};
export default NotificationList;
