/* eslint-disable prettier/prettier */
import useStore from '../../hook/useStore';
import './style.scss';
const CommentItem = (props) => {
  const { formatDay } = useStore();
  const { id, name, avatar, time, content } = props;
  return (
    <div className="comment-item">
      <div className="author-avatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${id}/${avatar}`}
          className="img-people"
          alt="avatar"
        />
        <div className="author-name">
          <p className="name">{name}</p>
          <p className="comment">{content}</p>
        </div>
      </div>
      <div className="comment-time">{formatDay(time)}</div>
    </div>
  );
};
export default CommentItem;
