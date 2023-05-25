/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import {formatDay} from '../../util/formatDay';
import { useStore } from '../../store';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const CommentItem = (props) => {
  const { state, dispatch } = useStore();
  const {onDelete, index} = props
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="comment-item">
      <div className="author-avatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${props?.author[0].id}/${props?.author[0].avatar}`}
          className="img-people"
          alt="avatar"
        />
          <div className="author-boxcontent">
            <div className="author-name">
              <div className="author-name-item">
              <p className="name">{props?.author[0]?.username}</p>
              </div>
              <p className="comment">{props?.content ? props?.content: props?.comment?.content}</p>
            </div>
            <div className="comment-time">{formatDay(props?.createdTimestamp ? props?.createdTimestamp : props?.comment?.createdTimestamp)}</div>
         </div>
        <div className="delete-comment-btn">
          <div className="delete-icon"  onClick={handleClickOpen}>
            <MoreHorizIcon />
          </div>
          {open ?(
            <div className="dialog-form">
            <p onClick={()=>handleDeleteComment(index)}>Xóa</p> 
            <p>Chỉnh Sữa</p> 
           </div>
          ) 
           : (<></>)}
       
        </div>
      </div>
    </div>
  );
};
export default CommentItem;
