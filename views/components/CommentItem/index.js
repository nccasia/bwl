import './style.scss';
import React from 'react';
import {formatDay} from '../../util/formatDay';
import {deleteComment} from "../../api/apiComment";
import {useStore} from "../../store";
import CommentInput from "../CommentInput";
import {editComment} from "../../api/apiComment"

const CommentItem = (props) => {
  const {state, dispatch}=useStore();
  const handleDelete = async () => {
    if(state.author?.id){
      deleteComment({id: props?._id, messageId: state.author?.id}).then(data => {
        if(data){
          dispatch({ type:"DELETE_COMMENT", payload: {messageId: props?.messageId, id: props?._id}});
        }
      })
    }
  }

  const [openEdit, setOpenEdit] =React.useState(false);
  const [input, setInput] = React.useState('');
  const [openButton, setOpenButton] =React.useState(false);
  React.useEffect(()=> {
    if(props?.content){
      setInput(props?.content);
    }
  }, [props?.content]);
  const handleClickComment = async() => {
    await editComment({
      id: props?._id, 
      content: input,
    }).then(data => {
      if(data){
        dispatch({
          type: "EDIT_COMMENT", 
          payload: {
            messageId: props?.messageId, 
            input: input,
            id: props?._id,
          }
        })
      }
      setOpenEdit(false);
    })
  };

  return (
    <div className="comment-item">
      <div className="author-avatar" onMouseOut={() => setOpenButton(false)}>
        <img
          src={`https://cdn.discordapp.com/avatars/${props?.author[0].id}/${props?.author[0].avatar}`}
          className="img-people"
          alt="avatar"
        />
        <div className="author-name">
          <div className="header-name">
            <p><b>{props?.author[0]?.username}</b></p>
            <p>{formatDay(props?.createdTimestamp ? props?.createdTimestamp : props?.comment?.createdTimestamp)}</p>
          </div>
          {!openEdit && <p className="comment">{props?.content}</p>}
          {openEdit && 
            <CommentInput 
              handleClickComment={handleClickComment}
              input={input}
              setInput={setInput} 
            />
          }
        </div>
      </div>
      {state.author?.id && props?.authorId === state.author?.id && (
        <div className="comment-button">
          <button onClick={() => setOpenEdit(!openEdit)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};
export default CommentItem;

