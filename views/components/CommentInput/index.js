/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faXmark } from '@fortawesome/free-solid-svg-icons';
import SendIcon from '@mui/icons-material/Send';
import { useStore } from '../../store';

function CommentInput(props) {
  const { state, dispatch } = useStore();
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const onEmojiClick = (emojiObject) => {
    props?.setInput(props?.input.concat(emojiObject.native));
    const currentText = textareaRef.current.innerText;
    const newText = currentText.concat(emojiObject.native);
    textareaRef.current.innerText = newText;
  };
  const textareaRef = React.useRef(null);
  const isDisabled = props.input.trim() === '';
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (!event.shiftKey) {
        props?.handleClickComment();
        textareaRef.current.style.height = '20px';
        textareaRef.current.innerText = '';
        event.preventDefault();
      }
    }
  };
  const wrapperRef = React.useRef(null);
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenEmoji(false);
    }
  };
  const [innerWidth, setInnerWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    if (props?.input !== '') {
      textareaRef.current.innerText = props?.input;
    }
    const textarea = document.getElementById('auto-resize-textarea');
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
    document.addEventListener('mousedown', handleClickOutside);
    const handleResize = () => {
      if (window.innerWidth) {
        setInnerWidth(window.innerWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEmojiIconClick = (event) => {
    event.stopPropagation();
    setOpenEmoji(!openEmoji);
  };
  const handleInputClick = () => {
    if (openEmoji) {
      setOpenEmoji(false);
    }
  };
  const font = 'Segoe UI Emoji';
  return (
    <div
      className="container-item-reactInfo"
      ref={wrapperRef}
      style={{ margin: 0 }}
    >
      <div
        style={{
          width: '100%',
          padding: '0 10px',
          backgroundColor: state.background ? '#242526f7' : 'white',
          color: '#6C7588',
          fontFamily: font,
        }}
      >
        <div
          id="auto-resize-textarea"
          ref={textareaRef}
          className="react-input"
          contenteditable="true"
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
          onInput={(event) => props?.setInput(event.target.innerText)}
          onPaste={(event) => {
            event.preventDefault();
            const pastedText = event.clipboardData.getData('text');
            const currentText = textareaRef.current.innerText;
            const newText = currentText.concat(pastedText);
            textareaRef.current.innerText = newText;
            props?.setInput(props?.input.concat(pastedText));
            textareaRef.current.style.color = '#6C7588';
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
              textareaRef.current.style.scrollHeight + 'px';
            textareaRef.current.style.backgroundColor = state.background
              ? 'rgb(43 44 45)'
              : 'white';
          }}
          style={{
            fontFamily: font,
            backgroundColor: state.background ? 'rgb(43 44 45)' : 'white',
          }}
        />
        <div className="container-item-icon">
          <div className="container-item-emoji">
            <FontAwesomeIcon
              className="input-icon"
              icon={openEmoji ? faXmark : faFaceSmile}
              onClick={handleEmojiIconClick}
            />
            {openEmoji && (
              <div className="emoji-box-comment">
                <Picker
                  data={data}
                  onEmojiSelect={onEmojiClick}
                  theme={state.background ? 'dark' : 'light'}
                  onClick={handleInputClick}
                  style={{ fontFamily: font}}
                  perLine={innerWidth > 400 ? 9 : 6}
                />
              </div>
            )}
          </div>
          <div
            onClick={() => {
              props?.handleClickComment();
              textareaRef.current.style.height = '20px';
              textareaRef.current.innerText = '';
            }}
          >
            <SendIcon
              className={`input-button ${isDisabled ? 'disabled' : ''}`}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentInput;
