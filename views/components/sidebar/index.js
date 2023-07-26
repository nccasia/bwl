/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import OnlineUsers  from "../OnlineUsers";
import InputPost  from "../InputPost";

const SideBar = () => {
  return (
    <div>
      <InputPost />
      <OnlineUsers />
    </div>
  );
};
export default SideBar;
