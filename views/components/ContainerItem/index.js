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
import {useStore} from "../../store";
import {postLike} from "../../api/apiLike";
import {getComment, postComment} from "../../api/apiComment";

const ContainerItem = (props) => {
  const {state, dispatch}=useStore();
  //const { handleComment, userProfile } = useStore();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [input, setInput] = useState('');
  //console.log('input', input);
  const onEmojiClick = (emojiObject) => {
    setInput(input.concat(emojiObject.native));
  };
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  // //const { link, reactList, totalReact, messageId, commentPost } = props;
  const [open, setOpen] = useState(false);
  const handleClick = (index) => {
    getComment(index).then(data => dispatch({type:"SET_COMMENTS", payload: {comments: data, messageId: index}}))
    setOpen(!open);
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
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  console.log(state.notification);
  return (
    <div 
      //key={messageId} 
      className="container-item" 
      style={{ backgroundColor: state.background ? "#242526": "white", color: props.openBackground ? "white": "#242526",}}
    >
      <UserInfo {...props} />
      <div className="container-item-img">
        <img src={`https://bwl.vn/images/${props?.links[0]}`} />
      </div>
      <ul className="container-item-reactTotal">
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
        ): null}
      </ul>
      <div className="container-item-react">
        <span 
          className="react-like" 
          onClick={() => {
            postLike(props?.messageId, state.author?.id).then(data => {
              if(data){
                dispatch({type: "CHANGE_LIKE", payload: {messageId: props?.messageId, like: data?.like}})
              }
            })
          }}
        >
          Thích
        </span>
        <span 
          onClick={() => handleClick(props?.messageId)} 
          className="react-comment"
        >
          Bình luận {"(" + String(props?.totalComment > 0 ? props?.totalComment : 0) + ")"}
        </span>
      </div>
      {open && props?.onComment && state.comments? state.comments.map((comment, index) => (
        <div className="comment" key={index}>
          <CommentItem {...comment}/>
        </div>
      )): null}
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
          <div onClick={handleClickComment}>
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
