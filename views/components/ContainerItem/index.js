import './style.scss';
import UserInfo from '../userInfo';
import React from 'react';
import {useStore} from "../../store";
import {getComment} from "../../api/apiComment";
import {postLike} from "../../api/apiLike";
import { toast } from 'react-toastify';
import EmojiLike from '../EmojiLike';
import  Comment from "../Comment";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage} from '@fortawesome/free-solid-svg-icons';

const ContainerItem = (props) => {
  const {state, dispatch}=useStore();
  const [open, setOpen] = React.useState(false);
  const handleClick = (index) => {
    getComment(index).then((data) =>
      dispatch({
        type: 'SET_COMMENTS',
        payload: { comments: data, messageId: index },
      }),
    );
    setOpen(!open);
  };

  const handleClickLike = async() => {
    if(state.author?.id){
      if(props?.authorId !== state.author?.id) {
        postLike(props?.messageId, state.author?.id).then(data => {
          if(data){
            dispatch({type: "CHANGE_LIKE", payload: {messageId: props?.messageId, like: data?.like}})
          }
        })
      } else {
        toast.warning('Ha ha, không được đâu!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.warning('Bạn cần đăng nhập để like!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  
  return (
    <div 
      className="container-item" 
      style={{ backgroundColor: state.background ? "#242526": "white", color: props.openBackground ? "white": "#242526",}}
    >
      <UserInfo {...props} />
      <div className="container-item-img">
        <img src={`https://bwl.vn/images/${props?.links[0]}`} />
      </div>
      <EmojiLike reactions={props?.reactions} totalLike={props?.totalLike} totalComment={props?.totalComment} messageId={props?.messageId}/>
      <div className="container-item-react">
        <span className="react-like" onClick={handleClickLike}>
          {props?.likes ? (
            <div
              className="react-like-icon"
              style={{ color: state.background ? 'white' : '' }}
            >
              <ThumbDownAltIcon
                className="like_icon"
                style={{ color: state.background ? 'white' : '' }}
              />
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
      {open && (
        <Comment comments={props?.comments} messageId={props?.messageId}/>
      )}
    </div>
  );
};
export default ContainerItem;
