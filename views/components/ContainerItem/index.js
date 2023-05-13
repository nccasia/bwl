/* eslint-disable prettier/prettier */
import './style.scss';
import UserInfo from '../userInfo';
import React, { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFaceSmile,
  faXmark,
  faPaperPlane,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import onClickOutside from 'react-click-outside';
import CommentItem from '../CommentItem';
import useStore from '../../hook/useStore';

const ContainerItem = (props) => {
  console.log('props --', props);
  console.log('pr --', props._id);
  const { handleComment, userProfile } = useStore();
  console.log("handleComment", userProfile)

  const [openEmoji, setOpenEmoji] = useState(false);
  const [input, setInput] = useState('');
  const [showMore, setShowMore] = useState(false);
  // console.log('input', input);

  const onEmojiClick = (emojiObject) => {
    setInput(input.concat(emojiObject.native));
  };
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClickComment();
    }
  };
  
  const { link, reactList, totalReact, messageId, commentPost, commentID} = props;
  console.log(props, "commentID")
  const [comments, setComments] = useState(commentPost);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
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
    handleComment({
      authorId: userProfile.userId,
      content: input,
      messageId: messageId,
    });
    setInput('')
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [visibleCommentCount, setVisibleCommentCount] = useState(3);
  
  const handleShowMore = () => {
    setShowMore(true);
    setVisibleCommentCount(commentPost.length);
  };
  
  const handleShowLess = () => {
    setShowMore(false);
    setVisibleCommentCount(3);
  };
////
  return (
    <div key={messageId} className="container-item">
      <UserInfo {...props} />
      <div className="container-item-img">
        <img src={`https://bwl.vn/images/${link}`} />
      </div>
      <div className="container-item-reactTotal">
        <div className="react-icon">
          {reactList.map((react) => {
            if (react.reactId !== '') {
              return (
                <li className="list-inline-item list-reaction">
                  <button className="btn-reaction">
                    {react.reactId !== '' ? (
                      <img
                        className="emoji"
                        src={`https://cdn.discordapp.com/emojis/${react.reactId}.png`}
                        alt={react.reactName}
                      />
                    ) : (
                      <img
                        className="emoji"
                        src="./assets/img/default-react.png"
                        alt={react.reactName}
                      />
                    )}
                  </button>
                </li>
              );
            }
          })}
          <div>{totalReact}</div>
        </div>
        <div className="comment-icon">
          <span>{comments.length > 0 ? comments.length : ``}</span>
          <FontAwesomeIcon className="icon-cmt" icon={faMessage} />
        </div>
      </div>
      <div className="container-item-react">
        <span className="react-like">Thích</span>
        <span onClick={() => handleClick()} className="react-comment">
          <FontAwesomeIcon className="icon-cmt"  icon={faMessage} /> 
          <span>Bình luận </span>
        </span>
      </div>
      {comments.slice(0, visibleCommentCount).map((comment) => (
      <div className="comment">
        <CommentItem
          avatar={comment.author[0].avatar}
          name={comment.author[0].username}
          id={comment.author[0].id}
          time={comment.createdTimestamp}
          content={comment.content}
        />
      </div>
    ))}
    {comments.length > 3 && (
      <b onClick={showMore ? handleShowLess : handleShowMore}>
        {showMore ? <p className='show'>Ẩn bớt</p> : <p className='show'>Xem thêm</p>}
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
          <div onClick={() => handleClickComment()}>
            <FontAwesomeIcon className="input-button" icon={faPaperPlane} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default onClickOutside(ContainerItem);
