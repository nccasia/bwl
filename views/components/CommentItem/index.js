/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import { formatDay } from '../../util/formatDay';
import { useStore } from '../../store';
import CommentInput from '../CommentInput';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Delcomment from '../delcomment';
import FeedbackComment from '../FeedbackComment';
import {
  postComment,
  postCommentLike,
  editComment,
  postPinComment,
} from '../../api/apiComment';
import { showToast } from '../../util/showToast';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';
import { changeNumber } from '../../util/changeNumber';
import { addTagText } from '../../util/addTagText';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const CommentItem = (props) => {
  const { state, dispatch } = useStore();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [openHiden, setOpenHiden] = React.useState('');
  const [hidenHeight, setHidenHeight] = React.useState([]);
  const divCommentRef = React.useRef(null);
  React.useEffect(() => {
    if (props?.content) {
      setInput(props?.content);
    }
    if (divCommentRef?.current && divCommentRef?.current?.scrollHeight) {
      setHidenHeight(() => divCommentRef?.current?.scrollHeight);
    }
  }, [props?.content, divCommentRef, openEdit]);

  const handleClickComment = async () => {
    if (input !== '') {
      if (state.author?.id) {
        await editComment({
          id: props?._id,
          content: input,
          messageId: state.author?.id,
        });
      } else {
        showToast('warning', 'You need to log in to comment.');
      }
    } else {
      showToast('warning', "You don't need to leave it blank.");
    }
    setOpenEdit(false);
  };

  const handledit = () => {
    setOpenEdit(!openEdit);
    setOpen(false);
  };

  const handleMoreIconClick = () => {
    setOpen(!open);
  };

  const handleContainerMouseLeave = () => {
    setOpen(false);
  };
  const [openFeedback, setOpenFeedback] = React.useState(false);
  const [feedback, setFeedback] = React.useState('');
  const handleClickFeedback = () => {
    setOpenFeedback(!openFeedback);
  };
  const handleClickCommentFeedback = async (index) => {
    if (feedback !== '') {
      if (state.author?.id) {
        await postComment({
          authorId: state.author?.id,
          content: feedback,
          messageId: props?.messageId,
          id: index,
        });
        setFeedback('');
      } else {
        showToast('warning', 'You need to log in to comment.');
      }
    } else {
      showToast('warning', "You don't need to leave it blank.");
    }
  };
  const handleClickLikeComment = (index) => {
    if (state.author?.id) {
      if (state.author?.id !== props?.author[0]?.id) {
        postCommentLike({
          messageId: props?.messageId,
          id: state.author?.id,
          onLike: index,
          commentId: props?._id,
        });
      }
    } else {
      showToast('warning', 'You need to log in to like.');
    }
  };
  const handlePinComment = (id, onPin) => {
    postPinComment({ id: id, onPin: !onPin });
    setOpen(false);
  };

  return (
    <div className="comment-item">
      <div className="author-avatar">
        <div className="author-image">
          {props?.author[0]?.id ? (
            <img
              src={`https://cdn.discordapp.com/avatars/${props?.author[0]?.id}/${props?.author[0]?.avatar}`}
            />
          ) : (
            <img
              src="./assets/img/person.png"
              className="img-people-avatar"
              alt="avatar"
            />
          )}
          {props?.length > 0 && <div className="author-image-line"></div>}
        </div>
        <div className="author-boxcontent">
          <div
            className="author-name"
            style={{
              backgroundColor: state.background ? '#282829f7' : '#ebedf0',
              color: '#6C7588',
              transition: !openEdit ? 'height 0.7s ease' : 'none',
              height:
                hidenHeight > 35 && !openEdit
                  ? openHiden !== props?._id
                    ? '100px'
                    : `${hidenHeight + 65}px`
                  : '100%',
            }}
          >
            <div className="author-name-item">
              <p className="name">
                {props?.author[0]?.username
                  ? props?.author[0]?.username
                  : 'The Lost'}
              </p>
              <div className="comment-time">
                {formatDay(
                  props?.createdTimestamp
                    ? props?.createdTimestamp
                    : props?.comment?.createdTimestamp,
                )}
              </div>
              {props?.onPin && (
                <p className="comment-pin-icon">
                  <PushPinIcon sx={{ fontSize: '14px' }} />
                </p>
              )}
            </div>
            {!openEdit && (
              <div className="comment-item-author">
                <div
                  dangerouslySetInnerHTML={{
                    __html: addTagText(props?.content),
                  }}
                  ref={divCommentRef}
                  style={{
                    overflow: 'hidden',
                    transition: 'max-height 0.7s ease',
                    maxHeight:
                      hidenHeight > 35
                        ? openHiden !== props?._id
                          ? '35px'
                          : '100%'
                        : 'none',
                  }}
                />
                {hidenHeight > 35 ? (
                  openHiden !== props?._id ? (
                    <p
                      className="comment-hiden"
                      onClick={() => {
                        setOpenHiden(props?._id);
                      }}
                    >
                      <KeyboardArrowDownIcon
                        sx={{ color: 'rgb(108, 117, 136', fontSize: '14px' }}
                      />
                      Show
                    </p>
                  ) : (
                    <p
                      className="comment-hiden"
                      onClick={() => {
                        setOpenHiden('');
                      }}
                    >
                      <KeyboardArrowUpIcon
                        sx={{ color: 'rgb(108, 117, 136', fontSize: '14px' }}
                      />
                      Hiden
                    </p>
                  )
                ) : null}
              </div>
            )}
            {openEdit && (
              <CommentInput
                handleClickComment={handleClickComment}
                input={input}
                setInput={setInput}
              />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '15px',
            }}
          >
            <div className="comment-like-div">
              <p onClick={() => handleClickLikeComment(true)}>
                {changeNumber(props.likeComment)}
                {props?.authorLike === true ? (
                  <ThumbUpAltIcon sx={{ fontSize: '15px' }} />
                ) : (
                  <ThumbUpOffAltIcon sx={{ fontSize: '15px' }} />
                )}
              </p>
              <p onClick={() => handleClickLikeComment(false)}>
                {changeNumber(props.dislikeComment)}
                {props?.authorLike === false ? (
                  <ThumbDownAltIcon sx={{ fontSize: '15px' }} />
                ) : (
                  <ThumbDownOffAltIcon sx={{ fontSize: '15px' }} />
                )}
              </p>
              {props?.type === 'true' && (
                <p style={{ fontSize: '11px' }} onClick={handleClickFeedback}>
                  Reply
                </p>
              )}
            </div>
            {props?.onEdit && <p style={{ fontSize: '8px' }}>đã chỉnh sửa</p>}
          </div>
        </div>
        {state.author?.id &&
          (props?.author[0]?.id === state.author?.id ||
            props?.authorMessage === state.author?.id) && (
            <div
              className="delete-comment-btn"
              onMouseLeave={handleContainerMouseLeave}
            >
              <div
                className={
                  state.background ? 'delete-icon-dark' : 'delete-icon-light'
                }
                onClick={handleMoreIconClick}
              >
                <MoreHorizIcon />
              </div>
              {open ? (
                <div
                  className={
                    state.background ? 'dialog-form-dark' : 'dialog-form-light'
                  }
                >
                  {props?.authorMessage === state.author?.id && (
                    <div
                      className="content"
                      onClick={() => handlePinComment(props?._id, props?.onPin)}
                    >
                      <PushPinIcon sx={{ fontSize: '13px' }} />
                      <p>{props?.onPin ? 'Unpin' : 'Pin'}</p>
                    </div>
                  )}
                  {props?.author[0]?.id === state.author?.id && (
                    <div>
                      <div className="content" onClick={handledit}>
                        <EditIcon sx={{ fontSize: '13px' }} />
                        <p>Edit</p>
                      </div>
                      <div className="content">
                        <Delcomment id={props?._id} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
      </div>
      <div style={{ paddingRight: '5px' }}>
        {openFeedback && (
          <CommentInput
            handleClickComment={() => handleClickCommentFeedback(props?._id)}
            input={feedback}
            setInput={setFeedback}
          />
        )}
        <FeedbackComment
          length={props?.length}
          item={props?.itemList}
          id={props?._id}
          messageId={props?.messageId}
          page={props.page}
          size={props.size}
          authorMessage={props?.authorMessage}
          loading={props?.loading}
        />
      </div>
    </div>
  );
};
export default CommentItem;
