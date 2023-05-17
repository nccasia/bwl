/* eslint-disable prettier/prettier */
import './style.scss';
import UserInfo from '../userInfo';
import React, { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { postLike } from '../../api/apiLike';
import { getComment, postComment } from '../../api/apiComment';

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
  const handleClickComment = () => {
    postComment({
      authorId: state.author?.id,
      content: input,
      messageId: props?.messageId,
    });
    setInput('');
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
    setVisibleCommentCount(state.comments?.length);
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

  const handleClickLike = () => {
    postLike(props?.messageId, state.author?.id).then((data) => {
      if (data) {
        setIsLiked(data?.like);
        localStorage.setItem(`isLiked_${props.messageId}`, data?.like);
        dispatch({
          type: 'CHANGE_LIKE',
          payload: { messageId: props?.messageId, like: data?.like },
        });
      }
    });
  };

  // const handleDelete = (messageId, index) => {
  //   deleteComment(messageId, index).then(() => {
  //     dispatch({
  //       type: 'DELETE_COMMENT',
  //       payload: { messageId, index },
  //     });
  //   });
  // };
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
        <div className="react-icon">
          {props?.reactions?.map((main, index) => {
            return (
              <li key={index} className="list-inline-item list-reaction">
                <button className="btn-reaction">
                  {main.id ? (
                    <img
                      className="emoji"
                      src={`https://cdn.discordapp.com/emojis/${main.id}.png`}
                      alt={main.name}
                    />
                  ) : (
                    <img
                      className="emoji"
                      src="./assets/img/person.png"
                      alt="icon"
                    />
                  )}
                  {main.count}
                </button>
              </li>
            );
          })}
          {props?.totalLike > 0 ? (
            <li className="list-inline-item list-reaction">
              <button className="btn-reaction">
                <img
                  className="emoji"
                  src="./assets/img/default-react.png"
                  alt="icon"
                />
                {props?.totalLike}
              </button>
            </li>
          ) : null}
        </div>
        <div
          className="comment-icon"
          style={{ color: state.background ? 'white' : '' }}
        >
          <span>
            {String(props?.totalComment > 0 ? props?.totalComment : 0)}
          </span>
          <FontAwesomeIcon
            className="icon-cmt"
            style={{ color: state.background ? 'white' : '' }}
            icon={faMessage}
          />
        </div>
      </ul>
      <div className="container-item-react">
        <span className="react-like" onClick={handleClickLike}>
          {isLiked ? (
            <div className="react-like-icon">
              <ThumbDownAltIcon className="like_icon" />
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
      {open && props?.onComment && state.comments
        ? state.comments
            ?.slice(0, visibleCommentCount)
            .map((comment, index) => (
              <div className="comment" key={index}>
                {console.log('key', index)}
                <CommentItem
                  {...comment}
                  // index={index}
                  // onDelete={() =>
                  // handleDelete(props.messageId, index)}
                />
              </div>
            ))
        : null}
      {state.comments?.length > 3 && (
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
            <div>
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
      ) : (
        <></>
      )}
    </div>
  );
};
export default onClickOutside(ContainerItem);
