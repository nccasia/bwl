/* eslint-disable prettier/prettier */
import './style.scss';
const UserInfo = (props) => {
  const { authorAvatar, authorId, authorName, createdTimestampFormat } = props;
  return (
    <div className="userInfo-item">
      <div className="userInfo-item-UserAvatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${authorId}/${authorAvatar}`}
        />
      </div>
      <div className="userInfo-item-userInfo">
        <p className="userInfo-name">{authorName}</p>
        <p className="userInfo-time">{createdTimestampFormat}</p>
      </div>
    </div>
  );
};
export default UserInfo;
