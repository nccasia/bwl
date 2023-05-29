import './style.scss';
import { formatDay } from '../../util/formatDay';
import React from 'react';
import { useStore } from '../../store';
const UserInfo = (props) => {
  const { state, dispatch } = useStore();
  return (
    <div className="userInfo-item">
      <div className="userInfo-item-UserAvatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${props?.author?.id}/${props?.author?.avatar}`}
        />
      </div>
      <div className="userInfo-item-userInfo">
        <p
          className="userInfo-name"
          style={{ color: state.background ? 'white' : '' }}
        >
          {props?.author?.username}
        </p>
        <p
          className="userInfo-time"
          style={{ color: state.background ? 'white' : '' }}>
          {formatDay(props?.createdTimestamp?.$numberDecimal || props?.createdTimestamp)}
        </p>
      </div>
    </div>
  );
};
export default UserInfo;
