import './style.scss';
import React from 'react';
import { formatDay } from '../../util/formatDay';
import { deleteComment } from '../../api/apiComment';
import { useStore } from '../../store';
import CommentInput from '../CommentInput';
import { editComment } from '../../api/apiComment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const CommentItem = (props) => {
  const { state, dispatch } = useStore();
  const handleDelete = async () => {
    if (state.author?.id) {
      deleteComment({ id: props?._id, messageId: state.author?.id }).then(
        (data) => {
          if (data) {
            dispatch({
              type: 'DELETE_COMMENT',
              payload: { messageId: props?.messageId, id: props?._id },
            });
          }
        },
      );
    }
  };
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [openButton, setOpenButton] = React.useState(false);
  React.useEffect(() => {
    if (props?.content) {
      setInput(props?.content);
    }
  }, [props?.content]);
  const handleClickComment = async () => {
    await editComment({
      id: props?._id,
      content: input,
    }).then((data) => {
      if (data?.message) {
        dispatch({
          type: 'EDIT_COMMENT',
          payload: {
            messageId: props?.messageId,
            input: input,
            id: props?._id,
          },
        });
      }
      setOpenEdit(false);
    });
  };

  return (
    <div className="comment-item">
      <div className="author-avatar" onMouseOut={() => setOpenButton(false)}>
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
            {!openEdit && <p className="comment">{props?.content}</p>}
            {openEdit && (
              <CommentInput
                handleClickComment={handleClickComment}
                input={input}
                setInput={setInput}
              />
            )}
          </div>
          <div className="comment-time">
            {formatDay(
              props?.createdTimestamp
                ? props?.createdTimestamp
                : props?.comment?.createdTimestamp,
            )}
          </div>
        </div>
        {state.author?.id && props?.authorId === state.author?.id && (
          <div className="delete-comment-btn">
            <div className="delete-icon" onClick={() => setOpen(true)}>
              <MoreHorizIcon />
            </div>
            {open ? (
              <div className="dialog-form">
                <p onClick={handleDelete}>Xóa</p>
                <p onClick={() => setOpenEdit(!openEdit)}>Chỉnh Sữa</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CommentItem;
