import './style.scss';
import UserInfo from '../userInfo';
import React from 'react';
import {useStore} from "../../store";
import {getComment} from "../../api/apiComment";
import {postLike} from "../../api/apiLike";
import { toast } from 'react-toastify';
import EmojiLike from '../EmojiLike';
import  Comment from "../Comment";

const ContainerItem = (props) => {
  const {state, dispatch}=useStore();
  const [open, setOpen] = React.useState(false);
  const handleClick = (index) => {
    getComment(index).then(data => dispatch({type:"SET_COMMENTS", payload: {comments: data, messageId: index}}))
    setOpen(!open);
  };

  const handleClickLike = async() => {
    if(state.author?.id){
      postLike(props?.messageId, state.author?.id).then(data => {
        if(data){
          dispatch({type: "CHANGE_LIKE", payload: {messageId: props?.messageId, like: data?.like}})
        }
      })
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
      <EmojiLike reactions={props?.reactions} totalLike={props?.totalLike} messageId={props?.messageId}/>
      <div className="container-item-react">
        <span 
          className="react-like" 
          onClick={handleClickLike}
        >
          {props?.onLike ? "Bỏ Thích": "Thích"}
        </span>
        <span 
          onClick={() => handleClick(props?.messageId)} 
          className="react-comment"
        >
          Bình luận {"(" + String(props?.totalComment > 0 ? props?.totalComment : 0) + ")"}
        </span>
      </div>
      {open && (
        <Comment comments={props?.comments} messageId={props?.messageId}/>
      )}
    </div>
  );
};
export default ContainerItem;
