/* eslint-disable prettier/prettier */
import './style.scss';
import { formatDay } from '../../util/formatDay';
import React, { useState } from 'react';
import { useStore } from '../../store';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const UserInfo = (props) => {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false)

  const handleMoreIconClick = () =>{
    setOpen(!open)
  }

  const handleContainerMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div className="userInfo-item">
      <div className="userInfo-item-UserAvatar">
        <img
          src={`https://cdn.discordapp.com/avatars/${props?.author?.id}/${props?.author?.avatar}`}
        />
      </div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
        <div className="userInfo-item-userInfo">
          <p className="userInfo-name">
            {props?.author?.username}
          </p>
          <p className="userInfo-time">
            {formatDay(props?.createdTimestamp?.$numberDecimal || props?.createdTimestamp)}
          </p>
        </div>
        {state.author?.id && props?.authorId === state.author?.id && (
          <div className="delete-post-btn"
            onMouseLeave={handleContainerMouseLeave}>
            <div className="delete-icon" onClick={handleMoreIconClick}>
              <MoreHorizIcon />
            </div>
            {open ? (
              <div className="dialog-form">
                <p onClick>Xóa</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default UserInfo;
