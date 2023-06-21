/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import CommentItem from '../CommentItem';
import { useStore } from '../../store';
import { postComment } from '../../api/apiComment';
import CommentInput from '../CommentInput';
import { getComment } from '../../api/apiComment';
import {showToast}  from "../../util/showToast";

function Comment(props) {
  const { state, dispatch } = useStore();
  const [input, setInput] = React.useState('');
  const handleClickComment = async () => {
    if (state.author?.id) {
      await postComment({
        authorId: state.author?.id,
        content: input,
        messageId: props?.messageId,
      })
      setInput('');
    } else {
      showToast("warning", 'Bạn cần đăng nhập để bình luận!');
    }
  };
  const numberComment = Math.ceil(props?.totalComment / state.size);
  const handleClickPage = async(index) => {
    if(numberComment > index){
      getComment({messageId: props?.messageId, page: index + 1}).then((data) =>
        dispatch({
          type: 'SET_COMMENTS_PAGE',
          payload: { comments: data, messageId: props?.messageId },
        }),
      );
    }
  }  

  return (
    <div className="container-comment">
      <CommentInput
        handleClickComment={handleClickComment}
        input={input}
        setInput={setInput}
      />
      {props?.comments
        ? props?.comments
            .map((comment, index) => (
              <div className="comment" key={index}>
                <CommentItem {...comment} />
              </div>
            ))
        : null}
      { numberComment > props?.pageComment && <p className="show-page-comment" onClick={() => handleClickPage(props?.pageComment)}>Xem thêm</p>}
    </div>
  );
}

export default Comment;
