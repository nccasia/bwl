import './style.scss';
import React, { useState } from 'react';
import CommentItem from '../CommentItem';
import onClickOutside from 'react-click-outside';
import { toast } from 'react-toastify';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import SendIcon from '@mui/icons-material/Send';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFaceSmile,
  faXmark,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { useStore } from '../../store';
import { postComment } from '../../api/apiComment';

function Comment(props) {
  const { state, dispatch } = useStore();
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [showMore, setShowMore] = useState(false);
  const [visibleCommentCount, setVisibleCommentCount] = React.useState(3);
  const handleShowMore = () => {
    setShowMore(true);
    setVisibleCommentCount(props?.comments.length);
  };

  const handleShowLess = () => {
    setShowMore(false);
    setVisibleCommentCount(3);
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
  };
  const onEmojiClick = (emojiObject) => {
    setInput(input.concat(emojiObject.native));
  };
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const wrapperRef = React.useRef(null);
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenEmoji(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isDisabled = input.trim() === '';
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClickComment();
    }
  };

  return (
    <div className="container-comment">
      {props?.comments
        ? props?.comments
            .slice(0, visibleCommentCount)
            .map((comment, index) => (
              <div className="comment" key={index}>
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div className="container-item-reactInfo" ref={wrapperRef}>
          <div style={{ width: '100%', padding: '0 10px' }}>
            <input
              type="text"
              className="react-input"
              placeholder="Thêm bình luận"
              value={input}
              onChange={handleInputChange}
              // ref={inputRef}
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
    </div>
  );
}

export default onClickOutside(Comment);
