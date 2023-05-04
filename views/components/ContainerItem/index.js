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
} from '@fortawesome/free-solid-svg-icons';
import onClickOutside from 'react-click-outside';
import CommentItem from '../CommentItem';
import useStore from '../../hook/useStore';

const ContainerItem = (props) => {
  const { handleComment, userProfile } = useStore();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [input, setInput] = useState('');
  console.log('input', input);
  const onEmojiClick = (emojiObject) => {
    setInput(input.concat(emojiObject.native));
  };
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const { link, reactList, totalReact, messageId, commentPost } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
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
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div key={messageId} className="container-item">
      <UserInfo {...props} />
      <div className="container-item-img">
        <img src={`https://bwl.vn/images/${link}`} />
      </div>
      <ul className="container-item-reactTotal">
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
        <span>{totalReact}</span>
      </ul>
      <div className="container-item-react">
        <span className="react-like">Thích</span>
        <span onClick={() => handleClick()} className="react-comment">
          Bình luận {commentPost.length > 0 ? commentPost.length : ``}
        </span>
      </div>
      {commentPost.map((comment) => (
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
