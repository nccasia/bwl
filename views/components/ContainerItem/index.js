/* eslint-disable prettier/prettier */
import './style.scss';
import UserInfo from '../userInfo';
import React, { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
  faFaceSmile,
  faXmark,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import onClickOutside from 'react-click-outside';
import CommentItem from '../CommentItem';
import { useStore } from '../../store';
import { postLike, getLikes } from '../../api/apiLike';
import { getReactions } from '../../api/apiReactions';
import { getComment, postComment } from '../../api/apiComment';
import { toast } from 'react-toastify';

const ContainerItem = (props) => {
  const { state, dispatch } = useStore();
  //const { handleComment, userProfile } = useStore();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [input, setInput] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [isLiked, setIsLiked] = useState(localStorage.getItem('isLiked') === 'true');
  // localStorage.setItem('isLiked', isLiked);
  const [visibleCommentCount, setVisibleCommentCount] = useState(3);
  console.log('props', props.authorId);
  const onEmojiClick = (emojiObject) => {
    setInput(input.concat(emojiObject.native));
  };
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const isDisabled = input.trim() === '';

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClickComment();
    }
  };
  // //const { link, reactList, totalReact, messageId, commentPost } = props;
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const handleClick = (index) => {
    getComment(index).then((data) =>
      dispatch({
        type: 'SET_COMMENTS',
        payload: { comments: data, messageId: index },
      }),
    );
    setOpen(!open);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const wrapperRef = useRef(null);
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenEmoji(false);
    }
  };
  const handleClickComment = async () => {
    if (state.author?.id) {
      await postComment({
        authorId: state.author?.id,
        content: input,
        messageId: props?.messageId,
      }).then((data) => {
        if (data?.success) {
          dispatch({
            type: 'ADD_COMMENTS',
            payload: { messageId: props?.messageId, comments: data?.data },
          });
          setInput('');
        }
      });
    } else {
      toast.warning('Bạn cần đăng nhập để bình luận!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setInput('');
  };

  const handleClickLike = async () => {
    if (state.author?.id) {
      postLike(props?.messageId, state.author?.id).then((data) => {
        if (data) {
          dispatch({
            type: 'CHANGE_LIKE',
            payload: { messageId: props?.messageId, like: data?.like },
          });
        }
      });
    } else {
      toast.warning('Bạn cần đăng nhập để like!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const [like, setLike] = useState([]);
  const [openLike, setOpenLike] = useState(false);
  const handleClickGetLike = async () => {
    await getLikes(props?.messageId).then((item) => setLike(item?.likes));
    setOpenLike(true);
  };

  const [reactions, setReactions] = useState([]);
  const [openReactions, setOpenReactions] = useState(false);
  const handleClickGetReactions = async (index) => {
    await getReactions(props?.messageId).then((item) => {
      const list = item?.reactions?.filter(
        (main) => main.emoji === index.emoji,
      );
      setReactions({ list, index });
    });
    setOpenReactions(true);
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
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  console.log(state.notification);

  const handleShowMore = () => {
    setShowMore(true);
    setVisibleCommentCount(props?.comments.length);
  };

  const handleShowLess = () => {
    setShowMore(false);
    setVisibleCommentCount(3);
  };
  console.log(state.comments, 'comments');

  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    const likedValue = localStorage.getItem(`isLiked_${props.messageId}`);
    setIsLiked(likedValue === 'true');
  }, [props.messageId]);
  return (
    <div
      //key={messageId}
      className="container-item"
      style={{
        backgroundColor: state.background ? '#242526' : 'white',
        color: props.openBackground ? 'white' : '#242526',
      }}
    >
      <UserInfo {...props} />
      <div className="container-item-img">
        <img src={`https://bwl.vn/images/${props?.links[0]}`} />
      </div>
      <ul className="container-item-reactTotal">
        <div className="dialog-like">
          {props?.reactions?.map((main, index) => {
            return (
              <li key={index} className="list-inline-item list-reaction">
                <div
                  className="btn-reaction"
                  onMouseOver={() => handleClickGetReactions(main)}
                  onMouseOut={() => setOpenReactions(false)}
                >
                  {main.id ? (
                    <img
                      className="emoji"
                      src={`https://cdn.discordapp.com/emojis/${main.id}.png`}
                      alt={main.name}
                    />
                  ) : (
                    <p>{main?.name}</p>
                  )}
                  <p style={{ color: state.background ? 'white' : '' }}>
                    {main.count}
                  </p>
                </div>
              </li>
            );
          })}
          {openReactions && !openLike && (
            <div className="dialog-like-list">
              {changeReactions(reactions)?.main?.id ? (
                <img
                  className="reactions-emoji"
                  src={`https://cdn.discordapp.com/emojis/${
                    changeReactions(reactions)?.main?.id
                  }.png`}
                  alt={changeReactions(reactions)?.main?.name}
                />
              ) : (
                <p className="reactions-emoji">
                  {changeReactions(reactions)?.main?.name}
                </p>
              )}
              <p>
                <b>{changeReactions(reactions)?.main?.name}:</b>
                {' đã được tương tác bởi: '}
                {changeReactions(reactions)?.list?.length < 4 ? (
                  changeReactions(reactions)?.list?.join(', ')
                ) : (
                  <span>
                    {changeReactions(reactions)?.list?.slice(0, 3).join(', ')}
                    {' và '}
                    <u>
                      {changeReactions(reactions)?.list?.length - 3}
                      {' người khác'}
                    </u>
                  </span>
                )}
              </p>
            </div>
          )}
          {props?.totalLike > 0 ? (
            <div className="dialog-like">
              <li className="list-inline-item list-reaction">
                <div
                  className="btn-reaction"
                  onMouseOver={handleClickGetLike}
                  //onMouseOver={() => setOpenLike(true)}
                  onMouseOut={() => setOpenLike(false)}
                >
                  <ThumbUpOffAltIcon
                    style={{ color: state.background ? 'white' : '' }}
                    className="emoji-like"
                  />
                  <p style={{ color: state.background ? 'white' : '' }}>
                    {props?.totalLike}
                  </p>
                </div>
              </li>
              {openLike && !openReactions && (
                <div className="dialog-like-list">
                  <ThumbUpOffAltIcon className="icon-like" />
                  <p>
                    <b>Like:</b>
                    {' đã được tương tác bởi: '}
                    {changeLike(like)?.length < 4 ? (
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
              )}
            </div>
          ) : null}
        </div>
        <div
          className="comment-icon"
          style={{ color: state.background ? 'white' : '' }}
        >
          <span>
            {String(props?.totalComment > 0 ? props?.totalComment : 0)}
          </span>
          <ChatBubbleOutlineIcon
            className="icon-cmt"
            style={{ color: state.background ? 'white' : '' }}
          />
        </div>
      </ul>
      <div className="container-item-react">
        <span className="react-like" onClick={handleClickLike}>
          {props?.onLike ? (
            <div
              className="react-like-icon"
              style={{ color: state.background ? 'white' : '' }}
            >
              <ThumbDownAltIcon
                className="like_icon"
                style={{ color: state.background ? 'white' : '' }}
              />
              <span>Bỏ Thích</span>
            </div>
          ) : (
            <div
              className="react-like-icon"
              style={{ color: state.background ? 'white' : '' }}
            >
              <ThumbUpAltIcon className="like_icon" />
              <span>Thích</span>
            </div>
          )}
        </span>
        <span
          onClick={() => handleClick(props?.messageId)}
          className="react-comment"
          style={{ color: state.background ? 'white' : '' }}
        >
          <FontAwesomeIcon
            className="icon-cmt"
            style={{ color: state.background ? 'white' : '' }}
            icon={faMessage}
          />
          <span>Bình luận </span>
        </span>
      </div>
      {open && props?.comments
        ? props?.comments
            .slice(0, visibleCommentCount)
            .map((comment, index) => (
              <div className="comment" key={index}>
                {console.log('key', index)}
                <CommentItem {...comment} />
              </div>
            ))
        : null}
      {props?.comments.length > 3 && (
        <b onClick={showMore ? handleShowLess : handleShowMore}>
          {showMore ? (
            <p className="show">Ẩn bớt</p>
          ) : (
            <p className="show">Xem thêm</p>
          )}
        </b>
      )}
      {open ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className="container-item-reactInfo" ref={wrapperRef}>
            <div style={{width: "100%", padding: "0 10px"}}>
              <input
                type="text"
                className="react-input"
                placeholder="Thêm bình luận"
                value={input}
                onChange={handleInputChange}
                ref={inputRef}
                autoFocus
                onKeyDown={handleKeyDown}
              />
              <div className="container-item-icon">
                <div className="container-item-emoji">
                  {!openEmoji ? (
                    <FontAwesomeIcon
                      className="input-icon"
                      icon={faFaceSmile}
                      onClick={() => setOpenEmoji(!openEmoji)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="input-icon"
                      icon={faXmark}
                      onClick={() => setOpenEmoji(!openEmoji)}
                    />
                  )}
                  {openEmoji && (
                    <div className="emoji-box">
                      <Picker data={data} onEmojiSelect={onEmojiClick} />
                    </div>
                  )}
                </div>
                <div onClick={handleClickComment}>
                  <SendIcon
                    className={`input-button ${isDisabled ? 'disabled' : ''}`}
                    disabled={isDisabled}
                />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default onClickOutside(ContainerItem);
