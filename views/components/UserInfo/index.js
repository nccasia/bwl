import './style.scss';
import {formatDay} from '../../util/formatDay';
import React from 'react';
const UserInfo = (props) => {
  return (
    <div className="userInfo-item">
      <div className="userInfo-item-UserAvatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${props?.author?.id}/${props?.author?.avatar}`}
        />
      </div>
      <div className="userInfo-item-userInfo">
        <p className="userInfo-name">{props?.author?.username}</p>
        <p className="userInfo-time">{formatDay(props?.createdTimestamp?.$numberDecimal)}</p>
      </div>
    </div>
  );
};
export default UserInfo;
