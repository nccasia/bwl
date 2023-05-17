import React from 'react';
import UserInfo from '../userInfo';
import './style.scss';
import {useStore} from "../../store";

const SideBarItem = (props) => {
  const {state, dispatch}=useStore();
  return (
    <div className="sidebar-item" style={{ backgroundColor: state.background ? "#242526": "white", color: state.background ? "white": "#242526",}}>
      <div className="sidebar-item-image">
        <img src={`https://bwl.vn/images/${props?.links[0]}`} />
      </div>
      <UserInfo {...props} />
    </div>
  );
};
export default SideBarItem;
