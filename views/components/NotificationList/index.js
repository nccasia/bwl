/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import { changeTime } from '../../util/changeTime';
import { useStore } from '../../store';
import CircularProgress from '@mui/material/CircularProgress';
import { getNotification, postNotification } from '../../api/apiNotification';
import { truncatedContent } from '../../util/truncatedContent';

const NotificationList = (props) => {
  const { state, dispatch } = useStore();
  const handleChangePage = async (index) => {
    dispatch({type: "SET_SEARCH_MESSAGE", payload: index});
    if(state?.notification[0]?.onLabel){
      postNotification(state.author?.id);
    }
  };

  React.useEffect(() => {
    if (state.author?.id && state.pageNotification > 0 && props?.openNotification) {
      getNotification({ messageId: state.author.id, page: state.pageNotification },dispatch);
    }
  }, [state.pageNotification, state.author?.id, props?.openNotification]);

  return (
    <div>
      {state.notification
        ? state.notification.map((main, index) => {
            const truncated = truncatedContent(main?.content);
            const truncateditem = truncatedContent(main?.contentItem);
            return (
              <div
                key={index}
                onClick={() => handleChangePage(main?.messageId)}
                className="notification-list"
              >
                <div className="list-notifi">
                  {main?.author[0]?.id ? (
                    <img
                      className="list-notifi-image"
                      src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`}
                      alt="avatar"
                    />
                  ): (
                    <img
                      src="./assets/img/person.png"
                      className="img-people-avatar"
                      alt="avatar"
                    />
                  )}
                  {main?.onComment ? (
                    <span>
                      <p>
                        <b
                          style={{
                            color: state.background ? '#c0c0cd' : 'black',
                          }}
                        >
                          {main?.author[0]?.username ? main?.author[0]?.username : "The Lost"}
                        </b>
                        {' đã' +
                          main?.onComment +
                          ' bình luận bài viết của bạn có nội dung:'}
                      </p>
                      <b className="ellipsis">"{truncated}"</b>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                  ) : main?.onItem ? (
                    <span>
                      <p>
                        <b
                          style={{
                            color: state.background ? '#c0c0cd' : 'black',
                          }}
                        >
                          {main?.author[0]?.username ? main?.author[0]?.username : "The Lost"}
                        </b>
                        {` đã ${main?.onItem} phản hồi vào bình luận: `}
                        <b className="ellipsis">"{truncateditem}"</b>
                        {main?.authorItem === state.author?.id
                          ? ' của bạn'
                          : 'trên bài viết của bạn'}
                        {', có nội dung như sau: '}
                        <b className="ellipsis">"{truncated}"</b>
                      </p>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                  ) : main?.onLikeItem ? (
                    <span>
                      <p>
                        <b
                          style={{
                            color: state.background ? '#c0c0cd' : 'black',
                          }}
                        >
                          {main?.author[0]?.username ? main?.author[0]?.username : "The Lost"}{' '}
                        </b>
                        {main?.onLikeItem === 'true'
                          ? ' đã thích'
                          : main?.onLikeItem === 'false'
                          ? ' đã bỏ thích'
                          : ' đã hờ hững '}
                        {' với bình luận '}
                        <b className="ellipsis"> "{truncateditem}"</b>
                        {' của bạn.'}
                      </p>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                  ) : (
                    <span>
                      <p>
                        <b
                          style={{
                            color: state.background ? '#c0c0cd' : 'black',
                          }}
                        >
                          {main?.author[0]?.username ? main?.author[0]?.username : "The Lost"}{' '}
                        </b>
                        {main?.onLike
                          ? ' đã thích bài viết của bạn.'
                          : ' đã bỏ thích bài viết của bạn.'}
                      </p>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                  )}
                  <img
                    src={
                      main?.message[0]?.source
                        ? `https://bwl.vn/assets/images/${main?.message[0]?.links[0]}`
                        : `https://bwl.vn/images/${main?.message[0]?.links[0]}`
                    }
                    className="notifi-list-image"
                  />
                </div>
                {main?.onLabel && <p className="new-notifi">New</p>}
              </div>
            );
          })
        : null}
      {state.loadingNotifi && (
        <div className="notifi-progress">
          <CircularProgress sx={{color: "rgb(108, 117, 136)"}}/>
        </div>
      )}
    </div>
  );
};
export default NotificationList;
