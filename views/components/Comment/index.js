/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import CommentItem from '../CommentItem';
import { useStore } from '../../store';
import { postComment } from '../../api/apiComment';
import CommentInput from '../CommentInput';
import { getComment } from '../../api/apiComment';
import { showToast } from '../../util/showToast';
import { updateSize } from '../../util/updateSize';
import CircularProgress from '@mui/material/CircularProgress';

function Comment(props) {
  const { state, dispatch } = useStore();
  const [input, setInput] = React.useState('');
  const handleClickComment = async () => {
    if (input !== '') {
      if (state.author?.id) {
        await postComment({
          authorId: state.author?.id,
          content: input,
          messageId: props?.messageId,
        });
        setInput('');
      } else {
        showToast('warning', 'You need to log in to comment.');
      }
    } else {
      showToast('warning', "You don't need to leave it blank.");
    }
  };
  const scrollRef = React.useRef(null);
  const [openSeeMore, setOpenSeeMore] = React.useState(0);
  const handleGetCommentPage = () => {
    if (props?.comments?.length < 5 && props?.total > props?.comments?.length) {
      const test = props?.total - props?.comments?.length;
      if (props?.total > 5) {
        handleGetPage();
      } else {
        getComment(
          {
            messageId: props?.messageId,
            page: 1,
            size: test,
            id: state.author?.id,
          },
          dispatch,
        );
      }
    }
  };
  const handleGetPage = () => {
    if (props?.comments?.length > 0 && props?.total > 5) {
      const numberComment = Math.ceil(props?.total / 5);
      const test = updateSize(props?.comments?.length);
      if (!props?.loading && numberComment > 1 && test?.page > 0) {
        if (
          (numberComment > test?.page && numberComment > 1) ||
          (numberComment === test?.page && test?.size === 5)
        ) {
          getComment(
            {
              messageId: props?.messageId,
              page: test?.page,
              size: test?.size,
              id: state.author?.id,
            },
            dispatch,
          );
        }
      }
    }
  };
  React.useEffect(() => {
    const scrollElement = scrollRef.current;
    setOpenSeeMore(scrollElement?.scrollHeight);
    const handleScroll = () => {
      if (
        scrollElement.scrollTop + scrollElement.clientHeight >=
        scrollElement.scrollHeight - 1
      ) {
        handleGetPage();
      }
    };
    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [
    props?.loading,
    props?.comments,
    props?.messageId,
    state.author?.id,
    props?.total,
    scrollRef,
  ]);

  return (
    <div className="container-comment">
      <CommentInput
        handleClickComment={handleClickComment}
        input={input}
        setInput={setInput}
      />
      <div
        className={`container-comment-scroll ${
          state.background ? 'scroll-dark' : 'scroll-light'
        }`}
        ref={scrollRef}
      >
        {props?.comments
          ? props?.comments.map((comment) => (
              <div className="comment" key={comment?._id}>
                <CommentItem
                  {...comment}
                  messageId={props?.messageId}
                  authorMessage={props?.author?.id}
                  type="true"
                />
              </div>
            ))
          : null}
        {props?.loading && (
          <div className="comment-progress">
            <CircularProgress sx={{ color: 'rgb(108, 117, 136)' }} />
          </div>
        )}
        {props?.comments?.length < 5 &&
          props?.total > props?.comments?.length &&
          openSeeMore < 380 && (
            <p className="show-page-comment" onClick={handleGetCommentPage}>
              See More
            </p>
          )}
      </div>
    </div>
  );
}

export default Comment;
