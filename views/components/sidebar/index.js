/* eslint-disable prettier/prettier */
import SideBarItem from '../SidebarItem';
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import {getHotPosts} from "../../api/apiPosts";
import CircularProgress from '@mui/material/CircularProgress';

const SideBar = () => {
  const {state, dispatch}=useStore();
  React.useEffect(() => {
    getHotPosts(dispatch);
  }, []);
  return (
    <div
      className="sidebar-left-content"
      style={{
        backgroundColor: state.background ? '#242526' : 'white',
        color: state.background ? 'white' : '#242526',
      }}
    >
      <h3 className="sidebar-left-title">Top BWL</h3>
      <div className="sidebar-center">
        {state?.hotPosts
          ? state?.hotPosts.map((post, index) => {
              return (
                <React.Fragment key={index}>
                  <SideBarItem {...post} />
                  <hr />
                </React.Fragment>
              );
            })
          : null}
        {state.loadingHotPost && (
          <div className="sidebar-progress">
            <CircularProgress />
          </div>
        )}
      </div>
      <div className="sidebar-left-bottom">
        <span>
          
        </span>
      </div>
    </div>
  );
};
export default SideBar;
