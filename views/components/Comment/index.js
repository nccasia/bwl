/* eslint-disable prettier/prettier */
import './style.scss';
import React, { useState } from 'react';
import CommentItem from '../CommentItem';
import { toast } from 'react-toastify';
import { useStore } from '../../store';
import { postComment } from '../../api/apiComment';
import CommentInput from '../CommentInput';

function Comment(props) {
  const { state, dispatch } = useStore();
  const [input, setInput] = React.useState('');
  const [showMore, setShowMore] = useState(false);
  const [visibleCommentCount, setVisibleCommentCount] = React.useState(3);
  const handleShowMore = () => {
    setShowMore(true);
    setVisibleCommentCount(props?.comments.length);
  };

  const handleShowLess = () => {
    setShowMore(false);
    setVisibleCommentCount(3);
  };
  const handleClickComment = async () => {
    if (state.author?.id) {
      await postComment({
        authorId: state.author?.id,
        content: input,
        messageId: props?.messageId,
      }).then((data) => {
        if (data) {
          dispatch({
            type: 'ADD_COMMENTS',
            payload: { messageId: props?.messageId, comments: data },
          });
          setInput('');
        }
      });
    } else {
      toast.warning('Bạn cần đăng nhập để bình luận!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className="container-comment">
      {props?.comments
        ? props?.comments
            .slice(0, visibleCommentCount)
            .map((comment, index) => (
              <div className="comment" key={index}>
                <CommentItem {...comment} />
              </div>
            ))
        : null}
      {props?.comments.length > 3 && (
        <b onClick={showMore ? handleShowLess : handleShowMore}>
          {showMore ? (
            <p className="show">Ẩn bớt</p>
          ) : (
            <p className="show">Xem thêm</p>
          )}
        </b>
      )}
      <CommentInput
        handleClickComment={handleClickComment}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}

export default Comment;
