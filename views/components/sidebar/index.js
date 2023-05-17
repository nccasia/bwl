/* eslint-disable prettier/prettier */
import SideBarItem from '../../components/SidebarItem';
import './style.scss';
import {useStore} from "../../store";
import React from 'react';
import {maxPosts} from '../../util/maxPosts';

const SideBar = (props) => {
  const {state, dispatch}=useStore();
  console.log("tt",state?.posts);
  return (
    <div className="sidebar-left-content" style={{ backgroundColor: state.background ? "#242526": "white", color: state.background ? "white": "#242526",}}>
      <h3 className="sidebar-left-title">Top BWL</h3>
      <div className="sidebar-center">
        {state?.hotPosts ? state?.hotPosts.map((post, index) => {
          return (
            <React.Fragment key={index}>
              <SideBarItem {...post}/>
              <hr />
            </React.Fragment>
          );
        }): null}
      </div>
      <div className="sidebar-left-bottom">
        <span>
          Privacy • Terms • Advertising • Ad Choices • Cookies • Flexbook © 2021
        </span>
      </div>
    </div>
  );
};
export default SideBar;
