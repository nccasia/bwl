import './style.scss';
import React from 'react';
import CommentItem from '../CommentItem';
import onClickOutside from 'react-click-outside';
import { toast } from 'react-toastify';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFaceSmile,
  faXmark,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import {useStore} from "../../store";
import {postComment} from "../../api/apiComment";

function Comment(props) {
    const {state, dispatch}=useStore();
    const [openEmoji, setOpenEmoji] = React.useState(false);
    const [input, setInput] = React.useState('');
    const handleClickComment = async() => {
        if(state.author?.id){
          await postComment({
            authorId: state.author?.id,
            content: input,
            messageId: props?.messageId,
          }).then(data => {
            if(data?.success){
              dispatch({type: "ADD_COMMENTS", payload: {messageId: props?.messageId, comments: data?.data}})
              setInput("");
            }
          });
        } else {
          toast.warning('Bạn cần đăng nhập để bình luận!', {
            position: "bottom-right",
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

    return (
        <div className="container-comment">
            {props?.comments ?  props?.comments.map((comment, index) => (
                <div className="comment" key={index}>
                    <CommentItem {...comment}/>
                </div>
            )): null}
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
        </div>
    )
}

export default onClickOutside(Comment);