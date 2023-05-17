/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import {formatDay} from '../../util/formatDay';
const CommentItem = (props) => {
  return (
    <div className="comment-item">
      <div className="author-avatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${props?.author[0].id}/${props?.author[0].avatar}`}
          className="img-people"
          alt="avatar"
        />
        <div className="author-name">
          <p className="name">{props?.author[0]?.username}</p>
          <p className="comment">{props?.content ? props?.content: props?.comment?.content}</p>
        </div>
      </div>
      <div className="comment-time">{formatDay(props?.createdTimestamp ? props?.createdTimestamp : props?.comment?.createdTimestamp)}</div>
    </div>
  );
};
export default CommentItem;
