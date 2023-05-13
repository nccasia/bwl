/* eslint-disable prettier/prettier */
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useStore from '../../hook/useStore';
import './style.scss';
const CommentItem = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { formatDay } = useStore();
  const { id, name, avatar, time, content, onDelete, } = props;
  // console.log("cmtid",props)
  const handleDelete = (_id) => {
    onDelete(_id);
  };
  // console.log("hhh",props._id)
  return (
    <div className="comment-item">
      <div className="author-avatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${id}/${avatar}`}
          className="img-people"
          alt="avatar"
        />
          <div className="author-boxcontent">
            <div className="author-name">
              <div className="author-name-item">
                <p className="name">{name}</p>
              </div>
              <p className="comment">{content}</p>
            </div>
            <p className="comment-time">{formatDay(time)}</p>
         </div>
        <div className="delete-comment-btn">
          <div className="delete-icon"  onClick={handleClickOpen}>
            <MoreHorizIcon />
          </div>
          {open ?(
            <div className="dialog-form">
            <p onClick={()=>handleDelete(_id)}>Xóa</p> 
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
