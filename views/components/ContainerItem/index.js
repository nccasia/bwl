/* eslint-disable prettier/prettier */
import './style.scss';
import UserInfo from '../userInfo';
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
import {showToast}  from "../../util/showToast";

const ContainerItem = (props) => {
  const { state, dispatch } = useStore();
  const [open, setOpen] = React.useState(false);
  const handleClick = async (index) => {
    setOpen(!open);
    if (open === false) {
      getComment({ messageId: index, page: 1 }).then((data) =>
        dispatch({
          type: 'SET_COMMENTS',
          payload: { comments: data, messageId: index },
        }),
      );
    }
  };

  const handleClickLike = async () => {
    if (state.author?.id) {
      if (props?.authorId !== state.author?.id) {
        postLike(props?.messageId, state.author?.id);
      } else {
        showToast("warning", 'Ha ha, không được đâu!');
      }
    } else {
      showToast("warning", 'Bạn cần đăng nhập để like!');
    }
  };

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
        <img src={props?.source ? `https://bwl.vn/assets/images/${props?.links[0]}` : `https://bwl.vn/images/${props?.links[0]}`} />
      </div>
      <EmojiLike
        reactions={props?.reactions}
        totalLike={props?.totalLike}
        totalComment={props?.totalComment}
        messageId={props?.messageId}
      />
      <div className="container-item-react">
        <span className="react-like" onClick={handleClickLike}>
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
      {open && <Comment {...props} />}
    </div>
  );
};
export default ContainerItem;
