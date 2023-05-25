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
  const [openLike, setOpenLike] = React.useState(false);
  const [reactions, setReactions] = React.useState([]);
  const [openReactions, setOpenReactions] = React.useState('');
  const [reactions1, setReactions1] = React.useState([]);

  const handleClickGetLike = async () => {
    await getLikes(props?.messageId).then((item) => {
      if (item?.likes) {
        setLike(item?.likes);
      }
    });
    setOpenLike(true);
    setOpenReactions(false);
  };
  const handleClickGetReactions = async (index) => {
    await getReactions({
      messageId: props?.messageId,
      emoji: index.emoji,
    }).then((item) => {
      setReactions({ list: item?.reactions, index: index });
    });
    setOpenReactions(index.emoji);
    setOpenLike(false);
  };
  const changeReactions = (index) => {
    if (index) {
      let list = [];
      index?.list?.forEach((item) => {
        list.push(item?.author[0]?.username);
      });
      return { list, main: index.index };
    }
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
        {props?.reactions?.map((main, index) => {
          return (
            <Tooltip
              arrow
              placement="top"
              open={openReactions === main.emoji ? true : false}
              onOpen={() => handleClickGetReactions(main)}
              onClose={() => setOpenReactions('')}
              key={index}
              title={
                <div
                  className="dialog-like-list"
                  onClick={() => setOpenList(main.emoji)}
                  style={{
                    display: 'flex',
                    gap: 5,
                    alignItems: 'center',
                    padding: '8px',
                    // position: 'absolute',
                    // top: '-30px',
                    // left: '50%',
                    // transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div>
                    {changeReactions(reactions)?.main?.id ? (
                      <img
                        className="reactions-emoji"
                        src={`https://cdn.discordapp.com/emojis/${
                          changeReactions(reactions)?.main?.id
                        }.png`}
                        alt={changeReactions(reactions)?.main?.name}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                        }}
                      />
                    ) : (
                      <p
                        className="reactions-emoji"
                        style={{ fontSize: "20px" }}
                      >
                        {changeReactions(reactions)?.main?.name}
                      </p>
                    )}
                  </div>
                  <p>
                    <b>{changeReactions(reactions)?.main?.name}:</b>
                    {' đã được tương tác bởi: '}
                    {changeReactions(reactions)?.list?.length < 4 ? (
                      changeReactions(reactions)?.list?.join(', ')
                    ) : (
                      <span>
                        {changeReactions(reactions)
                          ?.list?.slice(0, 3)
                          .join(', ')}
                        {' và '}
                        <u>
                          {changeReactions(reactions)?.list?.length - 3}
                          {' người khác'}
                        </u>
                      </span>
                    )}
                  </p>
                </div>
              }
            >
              <li className="list-inline-item list-reaction">
                <div className="btn-reaction">
                  {main.id ? (
                    <img
                      className="emoji"
                      src={`https://cdn.discordapp.com/emojis/${main.id}.png`}
                      alt={main.name}
                    />
                  ) : (
                    <p>{main?.name}</p>
                  )}
                  <span style={{ color: state.background ? 'white' : '' }}>
                    {main.count}
                  </span>
                </div>
              </li>
            </Tooltip>
          );
        })}
        {props?.totalLike > 0 ? (
          <Tooltip
            arrow
            placement="top"
            open={openLike}
            onOpen={handleClickGetLike}
            onClose={() => setOpenLike(false)}
            title={
              <div
                className="dialog-like-list"
                onClick={() => setOpenList('like-icon-x')}
                style={{
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                  padding: '8px',
                }}
              >
                <img
                  src="./assets/img/default-react.png"
                  alt="icon-like"
                  className="icon-like"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                  }}
                />
                <p>
                  <b>Like:</b>
                  {' đã được tương tác bởi: '}
                  {like && changeLike(like)?.length < 4 ? (
                    changeLike(like).join(', ')
                  ) : (
                    <span>
                      {changeLike(like)?.slice(0, 3).join(', ')}
                      {' và '}
                      <u>
                        <button>
                          {changeLike(like).length - 3}
                          {' người khác'}
                        </button>
                      </u>
                    </span>
                  )}
                </p>
              </div>
            }
          >
            <li className="list-inline-item list-reaction ">
              <div className="btn-reaction">
                <ThumbUpOffAltIcon
                  style={{ color: state.background ? 'white' : '' }}
                  className="emoji-like"
                />
                <span style={{ color: state.background ? 'white' : '' }}>
                  {props?.totalLike}
                </span>
              </div>
            </li>
          </Tooltip>
        ) : null}
      </div>

      <div
        className="comment-icon"
        style={{ color: state.background ? 'white' : '' }}
      >
        <span>{String(props?.totalComment > 0 ? props?.totalComment : 0)}</span>
        <ChatBubbleOutlineIcon
          className="icon-cmt"
          style={{ color: state.background ? 'white' : '' }}
        />
      </div>
    </ul>
  );
};
export default EmojiLike;
