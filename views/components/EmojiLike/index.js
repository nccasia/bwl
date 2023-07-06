/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import { getLikes } from '../../api/apiLike';
import { getReactions } from '../../api/apiReactions';
import Tooltip from '@mui/material/Tooltip';
import EmojiLikeList from '../EmojiLikeList';
import { useStore } from '../../store';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const EmojiLike = (props) => {
  const { state, dispatch } = useStore();
  const [like, setLike] = React.useState([]);
  const [reactions, setReactions] = React.useState([]);
  const [open, setOpen] = React.useState('');
  
  React.useEffect(()=> {
    const runList = async() => {
      if(open==="like-icon-x"){
        await getLikes({
          messageId:props?.messageId,
          size: false,
          page: 1,
        }).then((item) => {
          if (item?.likes) {
            setLike({likes: item?.likes, total: item?.total});
          }
        });
      }
      if(open !== "" && open!=="like-icon-x"){
        await getReactions({
          messageId: props?.messageId,
          emoji: open,
          size: false,
          page: 1,
        }).then((item) => {
          setReactions({ list: item?.reactions, total: item?.total });
        });
      }
    }
    runList();
  }, [open]);
  
  const handleClickGetLike = async () => {
    setOpen("like-icon-x");
  };
  const handleClickGetReactions = async (index) => {
    setOpen(index.emoji);
  };
  const changeLike = (index) => {
    if (index) {
      let list = [];
      index?.forEach((item) => {
        list.push(item?.author[0]?.username);
      });
      return list;
    }
  };

  const [openList, setOpenList] = React.useState('');
  return (
    <ul className="container-item-reactTotal">
      <div className="dialog-like">
        <EmojiLikeList
          open={openList}
          setOpen={setOpenList}
          like={like}
          listReactions={reactions?.list}
          {...props}
        />
        {props?.totalLike > 0 ? (
          <Tooltip
            arrow
            placement="top"
            open={open === "like-icon-x"? true : false}
            onOpen={handleClickGetLike}
            onClose={() => setOpen("")}
            title={
              <div
                className="dialog-like-list"
                onClick={() => setOpenList('like-icon-x')}
                style={{
                  display: 'flex',
                  gap: "5px",
                  alignItems: 'center',
                  padding: '8px',
                  cursor: 'pointer',
                }}
              >
                <ThumbUpOffAltIcon
                  style={{ color: state.background ? '#6C7588' : 'black' }}
                  className="emoji-like"
                />
                <p>
                  <b>Like:</b>
                  {' đã được tương tác bởi: '}
                  {like && like?.total< 4 ? (
                    changeLike(like?.likes).join(', ')
                  ) : (
                    <span>
                      {changeLike(like?.likes)?.slice(0, 3).join(', ')}
                      {' và '}
                      <u>
                        {like?.total - 3}
                        {' người khác'}
                      </u>
                    </span>
                  )}
                </p>
              </div>
            }
          >
            <li 
              className="list-inline-item list-reaction "
              onTouchStart={handleClickGetLike}
            >
              <div className="btn-reaction">
                <ThumbUpOffAltIcon
                  className="emoji-like"
                />
                <span>
                  {props?.totalLike}
                </span>
              </div>
            </li>
          </Tooltip>
        ) : null}
        {props?.reactions?.map((main, index) => {
          return (
            <Tooltip
              arrow
              placement="top"
              interactive
              open={open === main.emoji ? true : false}
              onOpen={() => handleClickGetReactions(main)}
              onClose={() => setOpen("")}
              key={index}
              title={
                <div
                  className="dialog-like-list"
                  onClick={() => setOpenList(main.emoji)}
                  style={{
                    display: 'flex',
                    gap: "5px",
                    alignItems: 'center',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    {main?.id ? (
                      <img
                        className="reactions-emoji"
                        src={`https://cdn.discordapp.com/emojis/${main?.id}.png`}
                        alt={main?.emoji}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                        }}
                      />
                    ) : (
                      <p
                        className="reactions-emoji"
                        style={{ fontSize: '20px' }}
                      >
                        {main?.emoji}
                      </p>
                    )}
                  </div>
                  <p>
                    <b>{main?.emoji}:</b>
                    {' đã được tương tác bởi: '}
                    {reactions?.total <= 3 ? (
                      changeLike(reactions?.list)?.join(', ')
                    ) : (
                      <span>
                        {changeLike(reactions?.list)
                          ?.slice(0, 3)
                          .join(', ')}
                        {' và '}
                        <u>
                          {reactions?.total-3}
                          {' người khác'}
                        </u>
                      </span>
                    )}
                  </p>
                </div>
              }
            >
              <li 
                className="list-inline-item list-reaction"
                onTouchStart={() => handleClickGetReactions(main)}
              >
                <div className="btn-reaction">
                  {main.id ? (
                    <img
                      className="emoji"
                      src={`https://cdn.discordapp.com/emojis/${main.id}.png`}
                      alt={main.emoji}
                    />
                  ) : (
                    <p>{main?.emoji}</p>
                  )}
                  <span>{main.count}</span>
                </div>
              </li>
            </Tooltip>
          );
        })}
      </div>

      <div
        className="comment-icon"
      >
        <span>{String(props?.totalComment > 0 ? props?.totalComment : 0)}</span>
        <ChatBubbleOutlineIcon
          className="icon-cmt"
        />
      </div>
    </ul>
  );
};
export default EmojiLike;
