/* eslint-disable prettier/prettier */
import SideBarItem from '../../components/SidebarItem';
import './style.scss';
import useStore from '../../hook/useStore';
import { Fragment } from 'react';
const SideBar = () => {
  const value = useStore();
  return (
    <div className="sidebar-left-content">
      <h3 className="sidebar-left-title">Top BWL</h3>
      {value.hotPost.map((post) => {
        return (
          <Fragment>
            <SideBarItem {...post} />
            <hr />
          </Fragment>
        );
      })}
      <div className="sidebar-left-bottom">
        <span>
          Privacy • Terms • Advertising • Ad Choices • Cookies • Flexbook © 2021
        </span>
      </div>
    </div>
  );
};
export default SideBar;
