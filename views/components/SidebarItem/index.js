import React from 'react';
import UserInfo from '../userInfo';
import './style.scss';
import {useStore} from "../../store";
import { useNavigate } from "react-router-dom";

const SideBarItem = (props) => {
  const {state, dispatch}=useStore();
  const navigate = useNavigate();
  const handleChangePage = async (index) => {
    await dispatch({type: "SET_POSTS_NULL"});
    navigate(`/posts?messageId=${index}`);
  }
  return (
    <div 
      className="sidebar-item"
      onClick={() => handleChangePage(props?.messageId)} 
      style={{ backgroundColor: state.background ? "#242526": "white", color: state.background ? "white": "#242526",}}
    >
      <div className="sidebar-item-image">
        <img src={`https://bwl.vn/images/${props?.links[0]}`} />
      </div>
      <UserInfo {...props} />
    </div>
  );
};
export default SideBarItem;
