import './style.scss';
import React from 'react';
import onClickOutside from 'react-click-outside';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFaceSmile,
  faXmark,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import SendIcon from '@mui/icons-material/Send';
import { useStore } from '../../store';

function CommentInput(props) {
  const { state, dispatch } = useStore();
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const onEmojiClick = (emojiObject) => {
    props?.setInput(props?.input.concat(emojiObject.native));
  };
  const handleInputChange = (event) => {
    props?.setInput(event.target.value);
  };

  const isDisabled = props.input.trim() === '';
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      props?.handleClickComment();
    }
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

  return (
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
            value={props?.input}
            onChange={handleInputChange}
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
            <div onClick={props?.handleClickComment}>
              <SendIcon
                className={`input-button ${isDisabled ? 'disabled' : ''}`}
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentInput;
