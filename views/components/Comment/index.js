/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import CommentItem from '../CommentItem';
import { useStore } from '../../store';
import { postComment } from '../../api/apiComment';
import CommentInput from '../CommentInput';
import { getComment } from '../../api/apiComment';
import {showToast}  from "../../util/showToast";
import {updateSize} from "../../util/updateSize";

function Comment(props) {
  const { state, dispatch } = useStore();
  const [input, setInput] = React.useState('');
  const handleClickComment = async () => {
    if(input !== ""){
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
    }else{
      showToast("warning", "Không để trống");
    }
  };
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(0);
  React.useEffect(()=>{
    if(props?.size){
      setSize(props?.size);
    }
    if(props.page){
      setPage(props.page);
    }
  },[props?.size, props.page]); 
  const numberComment= Math.ceil(size / 5);
  const handleClickPage = async(index) => {
    if(numberComment > index && numberComment >0){
      const test = updateSize(props?.comments?.length);
      getComment({messageId: props?.messageId, page: test?.page, size: test?.size, id: state.author?.id}, dispatch);
      setPage(test?.page);
      setSize(test?.size);
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
                <CommentItem 
                  {...comment} 
                  messageId={props?.messageId} 
                  type="true"
                />
              </div>
            ))
        : null}
      {numberComment > page && (
        <p 
          className="show-page-comment" 
          onClick={() => handleClickPage(page)}
        >
          Xem thêm
        </p>
      )}
    </div>
  );
}

export default Comment;
