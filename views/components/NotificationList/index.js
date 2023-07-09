/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import { changeTime } from '../../util/changeTime';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import CircularProgress from '@mui/material/CircularProgress';
import { getNotification } from '../../api/apiNotification';
import { truncatedContent } from '../../util/truncatedContent';

const NotificationList = (props) => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const handleChangePage = async (index) => {
    navigate(`/posts?messageId=${index}`);
  };

  React.useEffect(() => {
    if (state.author?.id && state.pageNotification > 0 && props?.openNotification) {
      getNotification({ messageId: state.author.id, page: state.pageNotification },dispatch);
    }
  }, [state.pageNotification, state.author?.id, props?.openNotification]);

  const [showFullContent, setShowFullContent] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleToggleContent = (index) => {
    setShowFullContent(true);
    setHoveredIndex(index);
  };

  const handleToggleContentLeave = () => {
    setShowFullContent(false);
    setHoveredIndex(null);
  };

  return (
    <div>
      {state.notification
        ? state.notification.map((main, index) => {
            const truncated = truncatedContent(main?.content);
            const truncateditem = truncatedContent(main?.contentItem);
            const content = main?.content ? truncated : '';
            const isHovered = index === hoveredIndex;
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
                        {' đã' +
                          main?.onComment +
                          ' bình luận bài viết của bạn có nội dung:'}
                      </p>
                      <div className="ellipsis">
                        {isHovered ? (
                          <div onMouseLeave={handleToggleContentLeave}>
                            {main?.content}
                          </div>
                        ) : (
                          <div onMouseEnter={() => handleToggleContent(index)}>
                            {truncated}
                          </div>
                        )}
                      </div>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                    <img
                      src={
                        main?.message[0]?.source
                          ? `https://bwl.vn/assets/images/${main?.message[0]?.links[0]}`
                          : `https://bwl.vn/images/${main?.message[0]?.links[0]}`
                      }
                      className="notifi-list-image"
                    />
                  </div>
                ) : main?.onItem ? (
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
                        {` đã ${main?.onItem} phản hồi vào bình luận: `}
                        <div className="ellipsis">
                          {isHovered && showFullContent ? (
                            <div onMouseLeave={handleToggleContentLeave}>
                              {main?.contentItem}
                            </div>
                          ) : (
                            <div
                              onMouseEnter={() => handleToggleContent(index)}
                            >
                              {truncateditem}
                            </div>
                          )}
                        </div>
                        {main?.authorItem === state.author?.id
                          ? 'của bạn'
                          : 'trên bài viết của bạn'}
                        {', có nội dung như sau:'}
                        <div className="ellipsis">
                          {isHovered && showFullContent ? (
                            <div onMouseLeave={handleToggleContentLeave}>
                              {main?.content}
                            </div>
                          ) : (
                            <div
                              onMouseEnter={() => handleToggleContent(index)}
                            >
                              {truncated}
                            </div>
                          )}
                        </div>
                      </p>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                    <img
                      src={
                        main?.message[0]?.source
                          ? `https://bwl.vn/assets/images/${main?.message[0]?.links[0]}`
                          : `https://bwl.vn/images/${main?.message[0]?.links[0]}`
                      }
                      className="notifi-list-image"
                    />
                  </div>
                ) : main?.onLikeItem ? (
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
                        {main?.onLikeItem === 'true'
                          ? ' đã thích'
                          : main?.onLikeItem === 'false'
                          ? ' đã bỏ thích'
                          : ' đã hờ hững '}
                        {' với bình luận '}
                        <div className="ellipsis">
                          {isHovered ? (
                            <div onMouseLeave={handleToggleContentLeave}>
                              {main?.contentItem}
                            </div>
                          ) : (
                            <div
                              onMouseEnter={() => handleToggleContent(index)}
                            >
                              {truncateditem}
                            </div>
                          )}
                        </div>
                        {' của bạn.'}
                      </p>
                      <p className="time-notifi">
                        {changeTime(main?.createdTimestamp)}
                      </p>
                    </span>
                    <img
                      src={
                        main?.message[0]?.source
                          ? `https://bwl.vn/assets/images/${main?.message[0]?.links[0]}`
                          : `https://bwl.vn/images/${main?.message[0]?.links[0]}`
                      }
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
                      src={
                        main?.message[0]?.source
                          ? `https://bwl.vn/assets/images/${main?.message[0]?.links[0]}`
                          : `https://bwl.vn/images/${main?.message[0]?.links[0]}`
                      }
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
          <CircularProgress sx={{color: "rgb(108, 117, 136)"}}/>
        </div>
      )}
    </div>
  );
};
export default NotificationList;
