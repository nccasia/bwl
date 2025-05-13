/* eslint-disable prettier/prettier */
import './style.scss';
import UserInfo from '../UserInfo';
import React from 'react';
import { useStore } from '../../store';
import { getComment } from '../../api/apiComment';
import { postLike } from '../../api/apiLike';
import EmojiLike from '../EmojiLike';
import Comment from '../Comment';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { showToast } from '../../util/showToast';

const ContainerItem = (props) => {
  const { state, dispatch } = useStore();
  const [open, setOpen] = React.useState(false);
  const divAnimationUp = React.useRef(null);
  const handleClick = (index) => {
    setOpen(!open);
    if (open === false) {
      getComment(
        {
          messageId: index,
          page: 1,
          size: 5,
          type: true,
          id: state.author?.id,
        },
        dispatch,
      );
    }
  };

  const handleClickLike = async (index) => {
    if (state.author?.id) {
      if (props?.author?.id !== state.author?.id) {
        postLike(props?.messageId, state.author?.id, !index);
      }
    } else {
      showToast('warning', 'You need to log in to like.');
    }
  };
  const [renderComment, setRenderComment] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setRenderComment(true);
    } else {
      setTimeout(() => {
        setRenderComment(false);
      }, 700);
    }
  }, [open]);

  return (
    <div
      className="container-item"
      style={{
        backgroundColor: state.background ? '#242526' : 'white',
        color: '#6C7588',
      }}
    >
      <UserInfo {...props} />
      <div className="container-item-img">
        <img
          src={
            props?.source
            ? `${props?.links[0]}`
              : `/assets/images/${props?.links[0]}`
          }
        />
      </div>
      <EmojiLike
        reactions={props?.reactions}
        totalLike={props?.totalLike}
        totalComment={props?.totalComment}
        messageId={props?.messageId}
        handleClick={handleClick}
      />
      <div className="container-item-react">
        <span
          className="react-like"
          onClick={() => handleClickLike(props?.likes)}
        >
          {props?.likes ? (
            <div className="react-like-icon">
              <ThumbDownAltIcon className="like_icon" />
              <span>Dislike</span>
            </div>
          ) : (
            <div className="react-like-icon">
              <ThumbUpAltIcon className="like_icon" />
              <span>Like</span>
            </div>
          )}
        </span>
        <span
          onClick={() => handleClick(props?.messageId)}
          className="react-comment"
        >
          <FontAwesomeIcon className="icon-cmt" icon={faMessage} />
          <span>Comment </span>
        </span>
      </div>
      <div
        ref={divAnimationUp}
        className={`comment-animation-div ${open ? 'open' : 'closed'}`}
      >
        {renderComment && <Comment {...props} />}
      </div>
    </div>
  );
};
export default ContainerItem;
